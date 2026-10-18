// ==UserScript==
// @name         Google 2009 favicon
// @namespace    levi.google2009
// @version      1.1.1
// @description  Swaps the browser tab icon on www.google.* for the 2009 favicon. Companion to the "Google 2009" Stylus style (CSS cannot change a favicon).
// @author       leroy
// @include      /^https?:\/\/www\.google\.[a-z.]+\//
// @run-at       document-start
// @grant        none
// ==/UserScript==
(function () {
  "use strict";
  var ICON = "data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA7PT7/3zF6/9Ptu//RbHx/0227/+Tzvb/9vv5/97h0f9JeBz/NHoA/z98Av9AfAD/PHsA/0F6AP8AAAAA/vz7/1+33/8Mp+z/FrHw/xWy8f8bs/T/Hqrx/3zE7v////7/t8qp/zF2A/87gwH/P4ID/z59AP8+egD/Q3kA/97s8v8botj/ELn3/wy58f8PtfL/D7Lw/xuz9P8vq+f/8/n///779v9KhR3/OYYA/0GFAv88hgD/QIAC/z17AP/0+/j/N6bM/wC07/8Cxf7/CsP7/wm+9v8Aqur/SrDb//7+/v///P7/VZEl/zSJAP87jQD/PYYA/0OBBf8+fQH///3//9Dp8/84sM7/CrDf/wC14/8CruL/KqnW/9ns8f/8/v//4OjX/z+GDf85kAD/PIwD/z2JAv8+hQD/PoEA/9C7pv/97uv////+/9Xw+v+w3ej/ls/e/+rz9///////+/z6/22mSf8qjQH/OJMA/zuQAP85iwL/PIgA/zyFAP+OSSL/nV44/7J+Vv/AkG7/7trP//7//f/9//7/6/Lr/2uoRv8tjQH/PJYA/zuTAP87kwD/PY8A/z2KAP89hAD/olkn/6RVHP+eSgj/mEgR//Ho3//+/v7/5Ozh/1GaJv8tlAD/OZcC/zuXAv84lAD/O5IC/z2PAf89iwL/OIkA/6hWFf+cTxD/pm9C/76ihP/8/v//+////8nav/8fdwL/NZsA/zeZAP83mgD/PJQB/zyUAf84jwD/PYsB/z6HAf+fXif/1r6s//79///58u//3r+g/+3i2v/+//3/mbiF/yyCAP87mgP/OpgD/zeWAP85lgD/OpEB/z+TAP9ChwH/7eHb/////v/28ej/tWwo/7tUAP+5XQ7/5M+5/////v+bsZn/IHAd/zeVAP89lgP/O5MA/zaJCf8tZTr/DyuK//3////9////0qmC/7lTAP/KZAT/vVgC/8iQWf/+//3///j//ygpx/8GGcL/ESax/xEgtv8FEMz/AALh/wAB1f///f7///z//758O//GXQL/yGYC/8RaAv/Ojlf/+/////////9QU93/BAD0/wAB//8DAP3/AAHz/wAA5f8DAtr///////v7+/+2bCT/yGMA/89mAP/BWQD/0q+D///+/////P7/Rkbg/wEA+f8AA/z/AQH5/wMA8P8AAev/AADf///7/P////7/uINQ/7lXAP/MYwL/vGIO//Lm3P/8/v//1dT2/woM5/8AAP3/AwH+/wAB/f8AAfb/BADs/wAC4P8AAAAA//z7/+LbzP+mXyD/oUwE/9Gshv/8//3/7/H5/zo/w/8AAdX/AgL6/wAA/f8CAP3/AAH2/wAA7v8AAAAAgAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAEAAA==";
  function keepIcon(ICON, id) {
    const SEL = 'link[rel~="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"], link[rel="mask-icon"], link[rel="fluid-icon"]';
    let busy = false, obs = null, watched = null, spent = [], off = false;
    const allowed = () => { const now = Date.now(); spent = spent.filter((t) => now - t < 10000); if (spent.length >= 12) { off = true; if (obs) obs.disconnect(); return false; } spent.push(now); return true; };
    const apply = (fresh) => {
      if (busy || off) return; const head = document.head; if (!head) return; busy = true;
      try {
        const others = [...head.querySelectorAll(SEL)].filter((l) => l.id !== id); let mine = document.getElementById(id);
        const wrong = !mine || mine.parentNode !== head || mine.getAttribute("href") !== ICON || mine.rel !== "icon" || mine !== head.lastElementChild && others.length;
        if (!others.length && !wrong && fresh !== true) return;
        if ((others.length || wrong) && !allowed()) return;
        for (const l of others) l.remove();
        if (wrong || fresh === true) { if (mine) mine.remove(); mine = document.createElement("link"); mine.id = id; mine.rel = "icon"; mine.type = "image/x-icon"; mine.href = ICON; head.appendChild(mine); }
      } finally { busy = false; if (obs) obs.takeRecords(); }
    };
    const watch = () => { if (off) return; const head = document.head; if (!head) { setTimeout(watch, 25); return; } if (head === watched) return; watched = head;
      if (obs) obs.disconnect(); obs = new MutationObserver(() => apply()); obs.observe(head, { childList: true, subtree: true, attributes: true, attributeFilter: ["href", "rel"] }); apply(); };
    watch();
    for (const ev of ["DOMContentLoaded", "load", "pageshow"]) window.addEventListener(ev, () => { watch(); apply(true); }, true);
    for (const ms of [250, 1500, 5000]) setTimeout(() => { watch(); apply(true); }, ms);
  }
  keepIcon(ICON, "g2009icon");
})();
