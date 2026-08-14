#!/usr/bin/env python3
"""
Scraper del catalogo de programas de CIFMEC (cifmec.edu.do) usando Scrapling.

IMPORTANTE - LEE ESTO PRIMERO:
Este script fue escrito y verificado contra la API real de Scrapling 0.4.14
(instalado y probado con `python3 -c "import inspect; ..."` para confirmar las
firmas de Fetcher.get / DynamicFetcher.fetch / StealthyFetcher.fetch y los
metodos .css()/.xpath()/adaptive del Selector). Sin embargo, NO pudo ejecutarse
contra cifmec.edu.do porque el entorno sandbox donde se escribio este script
tiene una politica de red que bloquea el dominio (y tambien bloquea la
descarga de los binarios de navegador que necesitan DynamicFetcher/
StealthyFetcher). Por lo tanto:

  - No hay datos reales de CIFMEC en /mnt/user-data/outputs/ todavia.
  - Los selectores CSS de abajo son deliberadamente robustos/genericos
    (basados en el patron de URL ?curso=slug que describiste, y en busqueda
    de texto por etiqueta para los detalles) porque nunca pude cargar la
    pagina real para inspeccionar su HTML exacto.
  - Corre este script en una maquina/entorno con acceso normal a internet
    (tu laptop, un servidor tuyo, o un entorno de Claude Code con politica
    de red abierta). Antes de la corrida real, revisa con el navegador
    (DevTools > Inspeccionar) la estructura de /programas y de una pagina de
    curso individual, y ajusta las constantes CSS_* si hace falta.

Instalacion (una sola vez):
    pip install "scrapling[fetchers]" --break-system-packages
    scrapling install        # descarga Chromium/Camoufox para los fetchers dinamicos

Uso:
    python3 cifmec_scraper.py
"""

import csv
import json
import random
import re
import sys
import time
from pathlib import Path
from urllib.parse import urljoin

from scrapling import DynamicFetcher, Fetcher, StealthyFetcher

BASE_URL = "https://cifmec.edu.do"
CATALOG_URL = f"{BASE_URL}/programas"
OUT_DIR = Path("/mnt/user-data/outputs")
DELAY_RANGE = (1.0, 2.0)  # segundos entre requests, scraping respetuoso
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)

# Enlaces de programa siguen el patron ?curso=slug segun lo descrito;
# buscar por ese patron es mas resiliente a un rediseño que depender
# de nombres de clase generados por Next.js.
CURSO_LINK_PATTERN = re.compile(r"[?&]curso=")

# Etiquetas (en minuscula, sin acentos) usadas para localizar cada campo
# dentro del texto de una pagina de curso, sin depender de selectores fijos.
FIELD_LABELS = {
    "descripcion": ["objetivo", "descripcion", "sobre el programa", "acerca de"],
    "duracion": ["duracion", "duracion:", "semanas", "meses", "horas academicas"],
    "modalidad": ["modalidad"],
    "precio": ["precio", "inversion", "costo", "rd$", "us$"],
    "requisitos": ["requisitos", "requisitos de admision", "requisitos de ingreso"],
    "sede": ["sede", "sedes", "lugar", "ubicacion"],
    "acreditacion": ["acreditacion", "aval", "avalado", "cmd", "aha", "uasd"],
    "inicio": ["inicio", "proxima cohorte", "fecha de inicio", "proximo grupo"],
}


def _strip_accents(text: str) -> str:
    replacements = str.maketrans("áéíóúñÁÉÍÓÚÑ", "aeiounAEIOUN")
    return text.translate(replacements)


def verify_installation():
    """Paso 1.3: confirma que los tres fetchers funcionan antes de scrapear."""
    print("Verificando instalacion de Scrapling...")

    try:
        r = Fetcher.get("https://example.com", stealthy_headers=True, timeout=20)
        print(f"  [OK] Fetcher (estatico): status={r.status}, "
              f"title={r.css_first('title::text') if hasattr(r, 'css_first') else r.css('title::text').get()}")
    except Exception as e:
        print(f"  [FALLO] Fetcher estatico: {e}")

    try:
        r = DynamicFetcher.fetch("https://example.com", headless=True, timeout=30_000)
        print(f"  [OK] DynamicFetcher: status={r.status}")
    except Exception as e:
        print(f"  [FALLO] DynamicFetcher (revisa 'scrapling install'): {e}")

    try:
        r = StealthyFetcher.fetch("https://example.com", headless=True, timeout=30_000)
        print(f"  [OK] StealthyFetcher: status={r.status}")
    except Exception as e:
        print(f"  [FALLO] StealthyFetcher (revisa 'scrapling install'): {e}")


def polite_sleep():
    time.sleep(random.uniform(*DELAY_RANGE))


def fetch_page(url: str):
    """
    Intenta DynamicFetcher (sitio Next.js con JS) primero.
    Si el resultado parece bloqueado/vacio (anti-bot), reintenta con StealthyFetcher.
    """
    try:
        resp = DynamicFetcher.fetch(
            url,
            headless=True,
            network_idle=True,
            timeout=30_000,
            extra_headers={"User-Agent": USER_AGENT},
        )
        looks_blocked = (
            resp.status in (403, 429)
            or not resp.css("a")
            or "captcha" in resp.body.lower()[:5000]
        )
        if not looks_blocked:
            return resp
        print(f"  Posible bloqueo anti-bot en {url}, probando StealthyFetcher...")
    except Exception as e:
        print(f"  DynamicFetcher fallo en {url} ({e}), probando StealthyFetcher...")

    return StealthyFetcher.fetch(
        url,
        headless=True,
        timeout=30_000,
        extra_headers={"User-Agent": USER_AGENT},
    )


def parse_catalog(resp) -> list[dict]:
    """
    Extrae {nombre, categoria, url} de la pagina /programas.
    Estrategia adaptativa: en vez de depender de clases CSS de Next.js
    (que cambian entre builds), localiza todos los <a href="...?curso=..."> y
    sube al contenedor de tarjeta mas cercano para sacar nombre/categoria.
    """
    programs = []
    links = resp.css("a")
    seen_urls = set()

    for link in links:
        href = link.attrib.get("href", "")
        if not CURSO_LINK_PATTERN.search(href):
            continue

        full_url = urljoin(BASE_URL, href)
        if full_url in seen_urls:
            continue
        seen_urls.add(full_url)

        # auto_save=True guarda la "huella" estructural de esta tarjeta para que,
        # si el sitio cambia de layout, relocate()/adaptive=True pueda re-encontrarla.
        card = link.find_ancestor(["article", "div", "li"]) or link

        name = (
            card.css_first("h1::text, h2::text, h3::text, h4::text")
            or link.get_all_text(strip=True)
            or link.attrib.get("title", "")
        )
        # La categoria suele ser un badge/etiqueta corto cerca del titulo;
        # se toma el texto mas corto del bloque que no sea el nombre.
        texts = [t.strip() for t in card.css("::text") if t.strip()]
        category = ""
        for t in texts:
            if t != name and 2 <= len(t) <= 40:
                category = t
                break

        programs.append({
            "nombre": name.strip() if isinstance(name, str) else "",
            "categoria": category,
            "url": full_url,
        })

    return programs


def extract_field(resp, labels: list[str]) -> str:
    """Busca un bloque de texto cuya etiqueta coincida y devuelve el valor asociado."""
    full_text = resp.get_all_text(strip=True) if hasattr(resp, "get_all_text") else resp.body
    normalized = _strip_accents(full_text.lower())

    for label in labels:
        label_norm = _strip_accents(label.lower())
        idx = normalized.find(label_norm)
        if idx == -1:
            continue
        snippet = full_text[idx: idx + 300]
        # quita la etiqueta y separadores tipo ":" del inicio
        snippet = re.sub(r"^[^:]{0,40}:\s*", "", snippet, count=1)
        # corta en el siguiente salto de linea doble o punto final largo
        snippet = re.split(r"\n{2,}", snippet)[0]
        return snippet.strip()[:250]

    return ""


def parse_program_detail(resp) -> dict:
    return {
        "descripcion": extract_field(resp, FIELD_LABELS["descripcion"]),
        "duracion": extract_field(resp, FIELD_LABELS["duracion"]),
        "modalidad": extract_field(resp, FIELD_LABELS["modalidad"]),
        "precio": extract_field(resp, FIELD_LABELS["precio"]),
        "requisitos": extract_field(resp, FIELD_LABELS["requisitos"]),
        "sede": extract_field(resp, FIELD_LABELS["sede"]),
        "acreditacion": extract_field(resp, FIELD_LABELS["acreditacion"]),
        "fecha_inicio": extract_field(resp, FIELD_LABELS["inicio"]),
    }


def main():
    verify_installation()

    print(f"\nObteniendo catalogo: {CATALOG_URL}")
    catalog_resp = fetch_page(CATALOG_URL)
    programs = parse_catalog(catalog_resp)
    print(f"  {len(programs)} programas encontrados en el listado.")

    if not programs:
        print("No se encontraron programas. Revisa manualmente el HTML de "
              "/programas e inspecciona el selector CURSO_LINK_PATTERN / parse_catalog().")
        sys.exit(1)

    for i, program in enumerate(programs, 1):
        print(f"  [{i}/{len(programs)}] {program['nombre']} -> {program['url']}")
        polite_sleep()
        try:
            detail_resp = fetch_page(program["url"])
            program.update(parse_program_detail(detail_resp))
        except Exception as e:
            print(f"    Error obteniendo detalle: {e}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    json_path = OUT_DIR / "cifmec_programas.json"
    csv_path = OUT_DIR / "cifmec_programas.csv"

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(programs, f, ensure_ascii=False, indent=2)

    fieldnames = [
        "nombre", "categoria", "url", "descripcion", "duracion", "modalidad",
        "precio", "requisitos", "sede", "acreditacion", "fecha_inicio",
    ]
    with open(csv_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for p in programs:
            writer.writerow({k: p.get(k, "") for k in fieldnames})

    print(f"\nListo. {len(programs)} programas guardados en:")
    print(f"  {json_path}")
    print(f"  {csv_path}")


if __name__ == "__main__":
    main()
