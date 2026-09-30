import json,re,os
import pathlib; SRC=str(pathlib.Path(__file__).parent)+'/'; OUT=str(pathlib.Path(__file__).parent.parent)+'/'
cfg=json.load(open(SRC+'config.json')) if os.path.exists(SRC+'config.json') else {}
res={f'art_{k}':f'/assets/art-{k}.webp' for k in ['lang','web','design','sci','biz','self','hero']}
res['https://unpkg.com/react@18.3.1/umd/react.production.min.js']='/vendor/react.production.min.js'
res['https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js']='/vendor/react-dom.production.min.js'
xdc=open(SRC+'xdc.html').read()
logic=open(SRC+'logic.js').read()
props=open(SRC+'props.txt').read() if os.path.exists(SRC+'props.txt') else ''
head=f'''<!DOCTYPE html>
<html lang="ar" dir="rtl"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>مدارك — منصة الدورات العربية</title>
<meta name="description" content="مدارك: منصة عربية لتعلّم الدورات أونلاين من مدرسين مصريين وعرب — ثانوية عامة، برمجة، تصميم، لغات، وبيزنس.">
<meta name="theme-color" content="#4F46E5">
<meta property="og:title" content="مدارك — منصة الدورات العربية">
<meta property="og:description" content="اشترِ الدورة اللي محتاجها بس، وكمّل من مكان ما وقفت.">
<meta property="og:image" content="/assets/og.webp">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/vendor/react.production.min.js" as="script">
<link rel="preload" href="/vendor/react-dom.production.min.js" as="script">
<link rel="stylesheet" href="/responsive.css">
<style>x-dc{{display:none!important}}
#md-splash{{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;background:#F8FAFC;font-family:"IBM Plex Sans Arabic",system-ui,sans-serif;transition:opacity .35s}}
#md-splash.md-hide{{opacity:0;pointer-events:none}}
#md-splash .b{{display:flex;flex-direction:column;align-items:center;gap:14px;color:#334155}}
#md-splash .l{{width:56px;height:56px;border-radius:16px;background:#4F46E5;color:#fff;display:grid;place-items:center;font-weight:700;font-size:26px;animation:mdp 1.2s ease-in-out infinite}}
#md-splash .e{{display:none;text-align:center;font-size:15px}} #md-splash.md-err .e{{display:block}} #md-splash.md-err .w{{display:none}}
#md-splash button{{margin-top:10px;height:42px;padding:0 18px;border:0;border-radius:12px;background:#4F46E5;color:#fff;font:inherit;font-weight:600;cursor:pointer}}
@keyframes mdp{{50%{{transform:scale(.9);opacity:.7}}}}
</style>
<script>window.__resources={json.dumps(res)};window.MADAREK={json.dumps(cfg)};</script>
<script src="/data.js"></script>
<script src="/player.js" defer></script>
</head>
<body>
<div id="md-splash" role="status"><div class="b"><div class="l">م</div><div class="w">جاري تحميل مدارك…</div><div class="e">تعذّر الاتصال بقاعدة البيانات.<br><button type="button" onclick="location.reload()">حاول تاني</button></div></div></div>
'''
html=head+xdc+'\n<script type="text/x-dc" data-dc-script="" data-props="'+props+'">'+logic+'</script>\n</body></html>'
open(OUT+'index.html','w').write(html)
print('built',len(html))
