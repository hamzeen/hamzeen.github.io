(function (l) {
    l.fn.rssfeed = function (d, h, v) {
        h = l.extend({
            limit: 3,
            offset: 1,
            header: !0,
            titletag: "h4",
            date: !0,
            dateformat: "datetime",
            content: !0,
            snippet: !0,
            media: !0,
            showerror: !0,
            errormsg: "",
            key: null,
            ssl: !1,
            linktarget: "_blank",
            linkredirect: "",
            linkcontent: !1,
            sort: "",
            sortasc: !0,
            historical: !1
        }, h);
        return this.each(function (x, p) {
            var t = l(p),
                f = "";
            h.ssl && (f = "s");
            t.hasClass("rssFeed") || t.addClass("rssFeed");
            if (null == d) return !1;
            0 < h.offset && (h.offset -= 1);
            h.limit += h.offset;
            f = "http" + f + "://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q=" + encodeURIComponent(d);
            f += "&num=" + h.limit;
            h.historical && (f += "&scoring=h");
            null != h.key && (f += "&key=" + h.key);
            l.getJSON(f + "&output=json_xml", function (j) {
                if (200 == j.responseStatus) {
                    var f = j.responseData,
                        e = h;
                    if (j = f.feed) {
                        var i = [],
                            c = 0,
                            d = "",
                            u = "odd";
                        if (e.media) {
                            var m = f.xmlString;
                            "Microsoft Internet Explorer" == navigator.appName ? (c = new ActiveXObject("Microsoft.XMLDOM"), c.async = "false", c.loadXML(m)) : c = (new DOMParser).parseFromString(m, "text/xml");
                            m = c.getElementsByTagName("item")
                        }
                        e.header && (d += "<h1>From the Blog</h1>");
                        d += '<div class="rssBody"><ul>';
                        for (f = e.offset; f < j.entries.length; f++) {
                            c = f - e.offset;
                            i[c] = [];
                            var g = j.entries[f],
                                a, b = "",
                                k = g.link;
                            switch (e.sort) {
                                case "title":
                                    b = g.title;
                                    break;
                                case "date":
                                    b = g.publishedDate
                            }
                            i[c].sort = b;
                            if (g.publishedDate) switch (b = new Date(g.publishedDate), a = b.toLocaleDateString() + " " + b.toLocaleTimeString(), e.dateformat) {
                                case "datetime":
                                    break;
                                case "date":
                                    a = b.toLocaleDateString();
                                    break;
                                case "time":
                                    a = b.toLocaleTimeString();
                                    break;
                                case "timeline":
                                    a = new Date(b);
                                    a = Math.round(((new Date).getTime() - a.getTime()) / 1E3);
                                    60 > a ? a = "< 1 min" : (3600 > a ? (a = Math.round(a / 60) - 1, b = "min") : 86400 > a ? (a = Math.round(a / 3600) - 1, b = "hour") : 604800 > a ? (a = Math.round(a / 86400) - 1, b = "day") : (a = Math.round(a / 604800) - 1, b = "week"), 1 < a && (b += "s"), a = a + " " + b);
                                    break;
                                default:
                                    a = b, b = new Date(a), a = e.dateformat, a = a.replace("dd", n(b.getDate())), a = a.replace("MM", n(b.getMonth() + 1)), a = a.replace("yyyy", b.getFullYear()), a = a.replace("hh", n(b.getHours())), a = a.replace("mm", n(b.getMinutes())), a = a.replace("ss",
                                    n(b.getSeconds()))
                            }
                            e.linkredirect && (k = encodeURIComponent(k));
                            i[c].html = "<" + e.titletag + '><a href="' + e.linkredirect + k + '" title="View this feed at ' + j.title + '">' + g.title + "</a></" + e.titletag + ">";
                            e.date && a && (i[c].html += "<div>" + a + "</div>");
                            e.content && (g = e.snippet && "" != g.contentSnippet ? g.contentSnippet : g.content, e.linkcontent && (g = '<a href="' + e.linkredirect + k + '" title="View this feed at ' + j.title + '">' + g + "</a>"), i[c].html += "<p>" + g + "</p>");
                            if (e.media && 0 < m.length && (k = m[f].getElementsByTagName("enclosure"), 0 < k.length)) {
                                i[c].html += '<div class="rssMedia"><div>Media files</div><ul>';
                                for (g = 0; g < k.length; g++) {
                                    var q = k[g].getAttribute("url"),
                                        r = k[g].getAttribute("type"),
                                        s = k[g].getAttribute("length"),
                                        b = i[c],
                                        w = i[c].html,
                                        q = '<li><a href="' + q + '" title="Download this media">' + q.split("/").pop() + "</a> (" + r + ", ",
                                        r = Math.floor(Math.log(s) / Math.log(1024)),
                                        s = (s / Math.pow(1024, Math.floor(r))).toFixed(2) + " " + "bytes kb MB GB TB PB".split(" ")[r];
                                    b.html = w + (q + s + ")</li>")
                                }
                                i[c].html += "</ul></div>"
                            }
                        }
                        e.sort && i.sort(function (a, b) {
                            if (e.sortasc) var c = a.sort,
                                d = b.sort;
                            else c = b.sort, d = a.sort;
                            if ("date" == e.sort) return new Date(c) - new Date(d);
                            c = c.toLowerCase();
                            d = d.toLowerCase();
                            return c < d ? -1 : c > d ? 1 : 0
                        });
                        l.each(i, function (a) {
                            d += '<li class="rssRow ' + u + '">' + i[a].html + "</li>";
                            u = "odd" == u ? "even" : "odd"
                        });
                        d += "</ul></div>";
                        l(p).html(d);
                        l("a", p).attr("target", e.linktarget)
                    }
                    l.isFunction(v) && v.call(this, t)
                } else h.showerror && (c = "" != h.errormsg ? h.errormsg : j.responseDetails), l(p).html('<div class="rssError"><p>' + c + "</p></div>")
            })
        })
    };
    var n = function (d) {
        d += "";
        2 > d.length && (d = "0" + d);
        return d
    }
})(jQuery);