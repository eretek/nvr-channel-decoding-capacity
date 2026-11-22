/*! Eretek Online Araçlar #80 — NVR Kanal ve Decode Kapasitesi */
ERT.def('80', {
	run: function (v, c) {
		var cams = c.lines(v.cams, 300, 'cams').map(function (l, i) {
			var p = l.split(/[;\t]/).map(function (x) { return x.trim(); }), n = ERT.parseNum(p[1], 'en'), mp, m = /^(\d{3,5})\s*[x×]\s*(\d{3,5})$/i.exec(p[2] || ''), b = ERT.parseNum(p[3], 'en');
			if (m) { mp = (+m[1]) * (+m[2]) / 1e6; } else { mp = ERT.parseNum(String(p[2] || '').replace(/\s*mp$/i, ''), 'en'); }
			if (!(n > 0) || Math.floor(n) !== n || !(mp > 0) || !(b > 0)) { throw c.fe('cams', 'rowFmt', { r: i + 1 }); }
			return { label: p[0], n: n, mp: mp, mbps: b };
		});
		var ch = cams.reduce(function (s, x) { return s + x.n; }, 0), bw = cams.reduce(function (s, x) { return s + x.n * x.mbps; }, 0);
		var eq = cams.reduce(function (s, x) { return s + x.n * x.mp / 2.0736; }, 0), rows = [], msgs = [], ok = true;
		var chk = function (k, use, cap, unit) { var u = use / cap, lvl = u > 1 ? 'err' : (u > 0.8 ? 'warn' : 'ok'); if (u > 1) { ok = false; } rows.push([c.t(k), c.n(use, 1) + unit, c.n(cap, 1) + unit, c.pct(u, 0)]); msgs.push([lvl, c.t(k + '_' + lvl)]); return u; };
		chk('ch', ch, v.maxch, '');
		chk('bw', bw, v.maxbw, ' Mbit/s');
		if (v.dec) { chk('dec', v.live ? eq * v.live / 100 : eq, v.dec, ' × 1080p'); }
		msgs.push(['info', c.t('eqNote')]);
		cams.forEach(function (x) { if (x.mp > 8.5) { msgs.push(['warn', c.t('big4k', { l: x.label })]); } });
		return { big: ok ? c.t('okB') : c.t('noB'), msgs: msgs, tables: [{ cols: [c.t('c_k'), c.t('c_u'), c.t('c_c'), c.t('c_p')], rows: rows }], x: { copy: rows.map(function (r) { return r.join(' | '); }).join('\n') }, v: { channels: ch, mbps: Math.round(bw * 100) / 100, eq1080: Math.round(eq * 100) / 100, ok: ok } };
	}
});
