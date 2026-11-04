#!/usr/bin/env python3
"""Genera las rutas /programas/<slug>/ e /institucion/ a partir de landing/index.html.

El sitio es un unico bundle: la vista (inicio, programa o institucion) se decide en
el navegador segun location.pathname. Este script solo clona el bundle en cada ruta
y ajusta titulo, descripcion, canonical, Open Graph y datos estructurados.

Uso:  python3 landing/build_pages.py
Es idempotente: se puede ejecutar varias veces tras editar landing/index.html.
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'index.html')
BASE = 'https://gpaacademy.online'
SUFFIX = ' | GPA Academy'

ORG = {
    "@context": "https://schema.org", "@type": "EducationalOrganization",
    "@id": BASE + "/#organizacion", "name": "GPA Academy", "url": BASE + "/",
    "email": "gpacademyrd@gmail.com", "telephone": "+1-849-387-5222",
    "address": {"@type": "PostalAddress", "addressLocality": "Santo Domingo", "addressCountry": "DO"},
    "description": "Educación médico-quirúrgica online y semipresencial.",
}

PROGRAMS = [
    ('taller-de-sutura', 'Taller de Sutura Online',
     'Entrenamiento paso a paso en técnicas de sutura, selección de materiales, manejo de instrumental y cierre de heridas. 100% online, 5 semanas.'),
    ('asistencia-quirurgica', 'Diplomado Avanzado en Asistencia Quirúrgica',
     'Asistir en quirófano con protocolo y confianza. Online (5 semanas) o semipresencial (8 semanas, con 8 prácticas quirúrgicas presenciales).'),
    ('interpretacion-de-neuroimagenes', 'Diplomado Avanzado en Interpretación de Neuroimágenes',
     'Interpretar TC y RM de cráneo y columna. Diplomado 100% online de 5 semanas, con clase de muestra.'),
    ('instrumentacion-laparoscopica', 'Diplomado Avanzado en Instrumentación Laparoscópica',
     'Manejar instrumental laparoscópico. Diplomado 100% online de 7 semanas, con la demo interactiva LAP//NEXUS.'),
    ('manejo-de-heridas-y-ostomias', 'Diplomado Avanzado en Manejo de Heridas y Ostomías',
     'Evaluar y tratar heridas y ostomías. Online o semipresencial, 7 semanas, con la demo interactiva ATLAS.'),
]

HOME_TITLE = 'GPA Academy — Formación médico-quirúrgica online y semipresencial'
HOME_DESC = ('Diplomados y talleres de asistencia quirúrgica, sutura, neuroimágenes, instrumentación '
             'laparoscópica y manejo de heridas. 100% online o semipresencial.')


def ld_blocks(kind, name=None, desc=None, url=None):
    blocks = [ORG]
    if kind == 'home':
        blocks.append({
            "@context": "https://schema.org", "@type": "ItemList", "name": "Programas de GPA Academy",
            "itemListElement": [
                {"@type": "ListItem", "position": i + 1, "url": f"{BASE}/programas/{slug}/", "name": n}
                for i, (slug, n, _) in enumerate(PROGRAMS)
            ],
        })
    elif kind == 'programa':
        blocks.append({
            "@context": "https://schema.org", "@type": "Course", "name": name, "description": desc,
            "inLanguage": "es", "url": url, "provider": {"@id": BASE + "/#organizacion"},
        })
    return ''.join('<script type="application/ld+json">%s</script>\n' % json.dumps(b, ensure_ascii=False) for b in blocks)


def patch(text, title, desc, url, ld, outer):
    """Ajusta metadatos en el HTML exterior (outer=True) o en la plantilla decodificada."""
    esc = lambda s: s.replace('&', '&amp;').replace('"', '&quot;')
    text = re.sub(r'<title>.*?</title>', '<title>%s</title>' % title, text, count=1, flags=re.S)
    text = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="%s">' % esc(desc), text, count=1)
    text = re.sub(r'<link rel="canonical" href="[^"]*">', '<link rel="canonical" href="%s">' % url, text, count=1)
    if outer:
        for prop in ('og:title', 'twitter:title'):
            text = re.sub(r'(<meta (?:property|name)="%s" content=")[^"]*(">)' % re.escape(prop), lambda m: m.group(1) + esc(title) + m.group(2), text, count=1)
        for prop in ('og:description', 'twitter:description'):
            text = re.sub(r'(<meta (?:property|name)="%s" content=")[^"]*(">)' % re.escape(prop), lambda m: m.group(1) + esc(desc) + m.group(2), text, count=1)
        text = re.sub(r'(<meta property="og:url" content=")[^"]*(">)', lambda m: m.group(1) + url + m.group(2), text, count=1)
    text = re.sub(r'[ \t]*<script type="application/ld\+json">.*?</script>\n?', '', text, flags=re.S)
    text = re.sub(r'(<link rel="canonical" href="[^"]*">\n?)', lambda m: m.group(1) + ld, text, count=1)
    return text


def split(raw):
    m = re.search(r'<script type="__bundler/template">\s*\n?', raw)
    start = m.end()
    end = raw.index('</script>', start)
    return raw[:start], json.loads(raw[start:end].strip()), raw[end:]


def render(pre, tpl, post, title, desc, url, ld):
    pre = patch(pre, title, desc, url, ld, True)
    tpl = patch(tpl, title, desc, url, ld, False)
    enc = json.dumps(tpl, ensure_ascii=True).replace('/', '\\/')
    return pre + enc + post


def write(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)


def main():
    raw = open(SRC, encoding='utf-8').read()
    pre, tpl, post = split(raw)

    home = render(pre, tpl, post, HOME_TITLE, HOME_DESC, BASE + '/', ld_blocks('home'))
    write(SRC, home)

    pre, tpl, post = split(home)
    urls = [BASE + '/']
    for slug, name, desc in PROGRAMS:
        url = f'{BASE}/programas/{slug}/'
        out = render(pre, tpl, post, name + SUFFIX, desc, url, ld_blocks('programa', name, desc, url))
        write(os.path.join(ROOT, 'programas', slug, 'index.html'), out)
        urls.append(url)
    inst_url = BASE + '/institucion/'
    inst_desc = ('GPA Academy: formación continua en cirugía y procedimientos médicos, online y semipresencial, '
                 'con sede en Santo Domingo, República Dominicana.')
    write(os.path.join(ROOT, 'institucion', 'index.html'),
          render(pre, tpl, post, 'Sobre GPA Academy' + SUFFIX, inst_desc, inst_url, ld_blocks('institucion')))
    urls.append(inst_url)

    sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    sm += ''.join('  <url><loc>%s</loc></url>\n' % u for u in urls) + '</urlset>\n'
    write(os.path.join(ROOT, 'sitemap.xml'), sm)
    print('Generadas %d rutas + sitemap.xml' % (len(urls) - 1))


if __name__ == '__main__':
    main()
