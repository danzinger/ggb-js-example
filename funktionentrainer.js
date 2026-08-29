/* Funktionentrainer -- linear functions.
   GeoGebra does two things here and both are kept: it draws the graph, and
   it decides whether the answer is right. The check is a real equivalence
   test (f == g), not a string comparison, which is why 3x+2, 2+x*3 and
   (x^3/x^2)*3+3-1 are all accepted. Everything around it is new. */
(function () {
  "use strict";

  var BRONZE = [165, 132, 94];
  var GROUND = { light: "#F5F2EC", dark: "#191814" };

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /* The generator and the check live here so a quadratic mode is a config
     entry rather than a rewrite. Scope today is linear only. */
  var Trainer = {
    current: null,

    next: function () {
      var p = randInt(-5, 5), q = randInt(1, 5), d = randInt(-5, 4);
      this.current = { p: p, q: q, d: d };
      ggbApplet.reset();
      ggbApplet.evalCommand("f(x)=" + p + "/" + q + "*x+" + d);
      ggbApplet.setColor("f", BRONZE[0], BRONZE[1], BRONZE[2]);
      ggbApplet.setLineThickness("f", 6);
      return this.current;
    },

    /* The guard rejects input GeoGebra would choke on before asking it.
       Kept from the original, with the intent written down: an answer must
       start with a digit, x, a bracket, or a single sign. */
    accepts: function (s) {
      if (!s) return false;
      return /^\d/.test(s) || /^x/.test(s) || /^\(/.test(s) ||
             (/^[-+]/.test(s) && s.length > 1 && !/^[-+][-+]/.test(s));
    },

    check: function (input) {
      if (!this.accepts(input)) return null;
      ggbApplet.evalCommand("g(x)=" + input);
      ggbApplet.evalCommand("isequal=f==g");
      var ok = ggbApplet.getValue("isequal") === 1 || ggbApplet.getValue("isequal") === true;
      if (!ok) ggbApplet.evalCommand("g(x)=?");
      return ok;
    },

    /* The equation, written out in the serif face from the numbers we
       already know. The original screenshotted GeoGebra's LaTeX into a
       base64 PNG: unselectable, unsearchable, wrong in dark mode. */
    equation: function () {
      var c = this.current, p = c.p, q = c.q, d = c.d;
      var g = (function gcd(a, b) { return b ? gcd(b, a % b) : Math.abs(a); })(p, q);
      var np = g ? p / g : p, nq = g ? q / g : q;
      var slope;
      if (np === 0)       slope = "0";
      else if (nq === 1)  slope = (np === 1 ? "" : np === -1 ? "−" : np) + "x";
      else                slope = "<span class=\"frac\"><span>" + Math.abs(np) +
                                  "</span><span>" + nq + "</span></span>·x";
      if (nq !== 1 && np < 0) slope = "−" + slope;

      var out = "f(x) = " + (np === 0 ? "" : slope);
      if (d !== 0 || np === 0) {
        out += np === 0 ? d : (d > 0 ? " + " + d : " − " + Math.abs(d));
      }
      return out;
    }
  };

  /* ---------- Wiring --------------------------------------------------- */
  function theme() {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  }

  function paintGround() {
    if (window.ggbApplet && ggbApplet.setGraphicsOptionForView) {
      try { ggbApplet.evalCommand('SetBackgroundColor("' + GROUND[theme()] + '")'); } catch (e) {}
    }
  }

  var els = {};
  var streak = 0;

  function ready() {
    els.form    = document.getElementById("answer");
    els.input   = document.getElementById("fx");
    els.reveal  = document.getElementById("reveal");
    els.sol     = document.getElementById("solution");
    els.dialog  = document.getElementById("result");
    els.rIcon   = document.getElementById("result-icon");
    els.rTitle  = document.getElementById("result-title");
    els.rBody   = document.getElementById("result-body");
    els.rAgain  = document.getElementById("result-again");
    els.streak  = document.getElementById("streak");
    els.hint    = document.getElementById("hint");

    document.getElementById("draw").addEventListener("click", start);
    els.form.addEventListener("submit", submit);
    els.reveal.addEventListener("click", reveal);
    els.rAgain.addEventListener("click", function () {
      els.dialog.close();
      if (els.rAgain.dataset.action === "next") start();
      else els.input.focus();
    });
  }

  function start() {
    Trainer.next();
    paintGround();
    els.sol.hidden = true;
    els.hint.hidden = true;
    els.form.hidden = false;
    els.input.value = "";
    els.input.focus();
  }

  function submit(e) {
    e.preventDefault();
    var v = els.input.value.trim();
    var r = Trainer.check(v);
    if (r === null) {
      els.hint.hidden = false;
      els.hint.textContent = "Das kann ich nicht lesen. Brüche als 1/2, Komma als Punkt.";
      return;
    }
    els.hint.hidden = true;
    show(r, v);
  }

  function show(ok, given) {
    els.dialog.classList.toggle("is-correct", ok);
    els.rIcon.innerHTML = document.getElementById(ok ? "i-check" : "i-alert").innerHTML;
    els.rTitle.textContent = ok ? "Richtig." : "Noch nicht.";
    els.rBody.innerHTML = ok
      ? "<p class=\"equation\">" + Trainer.equation() + "</p>"
      : "<p>Du hast <code>" + given.replace(/[<>&]/g, "") + "</code> eingegeben.</p>" +
        "<p class=\"nudge\">Stimmt die Steigung? Und der y-Achsenabschnitt?</p>";
    els.rAgain.textContent = ok ? "Nächste Funktion" : "Nochmal";
    els.rAgain.dataset.action = ok ? "next" : "retry";

    streak = ok ? streak + 1 : 0;
    var best = 0;
    try { best = parseInt(localStorage.getItem("ft-streak-best") || "0", 10); } catch (e) {}
    if (streak > best) {
      best = streak;
      try { localStorage.setItem("ft-streak-best", String(best)); } catch (e) {}
    }
    els.streak.textContent = streak > 1
      ? streak + " richtig in Folge" + (best > streak ? " · Bestwert " + best : "")
      : best > 0 ? "Bestwert " + best : "";

    els.dialog.showModal();
    els.rAgain.focus();
  }

  function reveal() {
    els.sol.hidden = false;
    els.sol.querySelector(".solution__equation").innerHTML = Trainer.equation();
  }

  /* GeoGebra calls this once the applet is live. */
  window.ggbOnInit = function () {
    paintGround();
    start();
  };

  document.addEventListener("DOMContentLoaded", function () {
    ready();
    new GGBApplet({
      appName: "classic",
      filename: "./function-quiz.ggb",
      showToolBar: false,
      showMenuBar: false,
      showAlgebraInput: false,
      showResetIcon: false,
      enableRightClick: false,
      enableShiftDragZoom: false,
      enableLabelDrags: false,
      scaleContainerClass: "plot",
      allowUpscale: true,
      appletOnLoad: function () { window.ggbOnInit(); }
    }, true).inject("plot");

    var t = document.querySelector("[data-theme-toggle]");
    if (t) {
      t.addEventListener("click", function () {
        var next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        try { localStorage.setItem("md-theme", next); } catch (e) {}
        paintGround();
      });
    }
  });
})();
