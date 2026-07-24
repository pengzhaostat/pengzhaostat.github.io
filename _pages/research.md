---
layout: page
title: Research
permalink: /research/
description: Statistical foundations and scalable methods for modern complex data.
nav: true
nav_order: 1
---

<link rel="stylesheet" href="{{ '/assets/css/research-highlight.css' | relative_url }}">

My research sits at the intersection of statistical theory, machine learning, and computation. I develop methods that remain interpretable and statistically principled while scaling to modern high-dimensional and structured datasets.

## High-dimensional statistics and implicit regularization

I study estimation and prediction when the number of parameters is comparable to or larger than the sample size. This includes implicit regularization from optimization algorithms, spectral methods, principal component regression, and procedures whose finite-time behavior can differ sharply from their limiting solutions.

<section class="research-highlight" id="negative-shifted-highlight" aria-labelledby="rh-title">
  <header class="rh-header">
    <p class="rh-kicker">Research Highlight · Preprint forthcoming</p>
    <h2 id="rh-title">Beyond Negative-Ridge Endpoints: Mixed-Sign Spectral Regularization via Negative-Shifted Gradient Descent</h2>
    <p class="rh-takeaway">Finite-time negative-shifted gradient descent crosses a spectral barrier that constrains every stable negative-ridge endpoint, enabling head anti-shrinkage and lower-spectrum control in one path.</p>
    <div class="rh-actions" aria-label="Forthcoming research links">
      <span class="rh-button is-disabled" aria-disabled="true" title="Link forthcoming">Paper</span>
      <span class="rh-button is-disabled" aria-disabled="true" title="Link forthcoming">arXiv</span>
      <span class="rh-button is-disabled" aria-disabled="true" title="Link forthcoming">Code</span>
    </div>
  </header>

  <div class="rh-background">
    <h3>Why high-dimensional prediction behaves differently</h3>
    <p>When the number of parameters exceeds the sample size, fitting the training data does not by itself determine test performance. Prediction depends on the sample covariance spectrum: a small leading head can carry the recoverable signal, while many weak directions determine how the fitted inverse behaves.</p>
    <p>A high-effective-rank tail can be weak coordinate by coordinate yet substantial in aggregate. In sample space, its Gram matrix is approximately a scalar floor,</p>
    <p class="rh-background-equation">\[\frac{1}{n}X_T X_T^\top\approx aI_n,\qquad a=\frac{\operatorname{tr}(\Sigma_T)}{n}.\]</p>
    <p>The head is therefore learned through a system resembling \(X_HX_H^\top/n+aI_n\), so ridgeless regression experiences implicit positive shrinkage on the signal-bearing directions. Positive ridge adds to that shrinkage. Negative ridge is the natural correction, but a stable endpoint is limited by both a pole and a tail-heavy filter shape.</p>
  </div>

  <div class="rh-common-spike">
    <p><strong>Start with the common-spike model.</strong> If a flat tail has level \(\lambda_T\) and aspect ratio \(\gamma_T=d_T/n\), its many weak directions create the effective floor</p>
    <div class="rh-equation-grid" aria-label="Common-spike mechanism equations">
      <div><span>Implicit floor</span>\[a=\gamma_T\lambda_T.\]</div>
      <div><span>Geometry-suggested shift</span>\[\nu_\star=a+\lambda_h.\]</div>
      <div><span>MP lower-edge heuristic</span>\[\widehat\mu_{\min}^{+}\approx a-2\sqrt{a\lambda_T}.\]</div>
    </div>
    <p>The shift \(\nu_\star\) therefore lies beyond the admissible stable-endpoint range \(0\leq\nu<\widehat\mu_{\min}^{+}\). This is the <strong>Marchenko–Pastur pole barrier</strong>.</p>
  </div>

  <ol class="rh-steps" aria-label="Three-step mechanism">
    <li><span class="rh-step-number">1</span><div><strong>Weak tail directions create an implicit ridge floor.</strong><p>Collectively, the high-effective-rank tail shrinks the signal-bearing head as if a positive ridge of size \(a\) were present.</p></div></li>
    <li><span class="rh-step-number">2</span><div><strong>Stable negative ridge meets a spectral barrier.</strong><p>The endpoint filter \(A_\nu(\mu)=\mu/(\mu-\nu)\) has a pole and amplifies smaller stable eigenvalues most—the wrong shape for head correction with tail control.</p></div></li>
    <li><span class="rh-step-number">3</span><div><strong>Finite time removes the endpoint restriction.</strong><p>Stopping before convergence makes the singularity removable and lets the displacement \(f_{\nu,t}(\mu)-1\) cross sign once, on a data-adaptive leading spectral prefix.</p></div></li>
  </ol>

  <figure class="rh-figure rh-interactive" data-nsgf-demo>
    <figcaption><strong>Figure A. Endpoint versus finite path.</strong> Stable negative ridge rises toward a pole; finite-time negative-shifted gradient flow remains smooth and can cross the ridgeless level once.</figcaption>
    <div class="rh-controls" aria-label="Interactive filter controls">
      <label for="rh-nu">Shift \(\nu\) <output id="rh-nu-value" for="rh-nu">1.30</output></label>
      <input id="rh-nu" type="range" min="0.50" max="2.00" step="0.05" value="1.30">
      <label for="rh-time">Stopping time \(t\) <output id="rh-time-value" for="rh-time">0.95</output></label>
      <input id="rh-time" type="range" min="0.20" max="1.60" step="0.05" value="0.95">
    </div>
    <svg id="rh-filter-svg" viewBox="0 0 760 390" role="img" aria-labelledby="rh-filter-title rh-filter-desc">
      <title id="rh-filter-title">Stable endpoint and finite-time spectral filters</title>
      <desc id="rh-filter-desc">An interactive plot of spectral filter against empirical eigenvalue. The stable negative-ridge endpoint has a vertical pole at nu. The negative-shifted finite-time path is smooth at nu and crosses the ridgeless level at one marked eigenvalue.</desc>
      <rect class="rh-region rh-tail-region" id="rh-tail-region" x="64" y="34" width="250" height="292"></rect>
      <rect class="rh-region rh-head-region" id="rh-head-region" x="314" y="34" width="398" height="292"></rect>
      <line class="rh-grid" x1="64" y1="229" x2="712" y2="229"></line>
      <line class="rh-axis" x1="64" y1="326" x2="712" y2="326"></line>
      <line class="rh-axis" x1="64" y1="34" x2="64" y2="326"></line>
      <line class="rh-ridgeless" x1="64" y1="229" x2="712" y2="229"></line>
      <line class="rh-pole" id="rh-pole" x1="320" y1="34" x2="320" y2="326"></line>
      <path class="rh-endpoint-path" id="rh-endpoint-path" d=""></path>
      <path class="rh-finite-path" id="rh-finite-path" d=""></path>
      <line class="rh-crossover-line" id="rh-crossover-line" x1="314" y1="34" x2="314" y2="326"></line>
      <circle class="rh-crossover-dot" id="rh-crossover-dot" cx="314" cy="229" r="5"></circle>
      <text class="rh-label" x="70" y="52">tail control</text>
      <text class="rh-label" x="560" y="52">head anti-shrinkage</text>
      <text class="rh-label" x="615" y="220">ridgeless f = 1</text>
      <text class="rh-label" id="rh-pole-label" x="326" y="72">pole μ = ν</text>
      <text class="rh-label" id="rh-crossover-label" x="320" y="250">crossover</text>
      <text class="rh-axis-label" x="650" y="364">eigenvalue μ</text>
      <text class="rh-axis-label" x="18" y="28">filter</text>
      <g class="rh-legend" aria-hidden="true">
        <line class="rh-endpoint-path" x1="82" y1="353" x2="112" y2="353"></line><text x="118" y="358">stable endpoint</text>
        <line class="rh-finite-path" x1="250" y1="353" x2="280" y2="353"></line><text x="286" y="358">finite path</text>
      </g>
    </svg>
    <p class="rh-formula">\[f_{\nu,t}(\mu)=\frac{\mu}{\mu-\nu}\left\{1-e^{-t(\mu-\nu)}\right\},\qquad f_{\nu,t}(\nu)=\nu t.\]</p>
  </figure>

  <figure class="rh-figure">
    <figcaption><strong>Figure B. The Marchenko–Pastur barrier.</strong> The population correction lies beyond the stable endpoint interval, while a finite-time path can operate there without taking an unstable inverse.</figcaption>
    <svg viewBox="0 0 760 300" role="img" aria-labelledby="rh-mp-title rh-mp-desc">
      <title id="rh-mp-title">Marchenko–Pastur endpoint barrier</title>
      <desc id="rh-mp-desc">A horizontal spectral scale marks the stable endpoint interval below the smallest positive empirical eigenvalue, the Marchenko–Pastur bulk, the tail floor a, and nu star equal to a plus lambda h beyond the stable interval. A blue arrow indicates that finite-time dynamics can use nu star.</desc>
      <line class="rh-axis" x1="70" y1="172" x2="704" y2="172"></line>
      <rect class="rh-mp-bulk" x="282" y="133" width="236" height="78" rx="8"></rect>
      <line class="rh-stable-interval" x1="80" y1="172" x2="268" y2="172"></line>
      <line class="rh-marker rh-edge-marker" x1="282" y1="112" x2="282" y2="220"></line>
      <line class="rh-marker rh-floor-marker" x1="445" y1="112" x2="445" y2="220"></line>
      <line class="rh-marker rh-star-marker" x1="640" y1="92" x2="640" y2="220"></line>
      <path class="rh-operation-arrow" d="M 520 78 C 565 42, 616 45, 637 82"></path>
      <polygon class="rh-arrow-head" points="637,82 626,73 626,88"></polygon>
      <text class="rh-label" x="92" y="150">admissible stable endpoints</text>
      <text class="rh-label" x="304" y="156">empirical MP bulk</text>
      <text class="rh-label" x="237" y="241">μ̂⁺min ≈ a − 2√(aλT)</text>
      <text class="rh-label" x="430" y="241">a</text>
      <text class="rh-label" x="590" y="241">ν★ = a + λh</text>
      <text class="rh-label rh-blue-text" x="508" y="39">finite-time path</text>
      <text class="rh-label" x="520" y="59">no endpoint convergence required</text>
    </svg>
  </figure>

  <figure class="rh-figure">
    <figcaption><strong>Figure C. Head anti-shrinkage, tail control.</strong> Mixed-sign refers to the displacement from ridgeless, \(f(\mu)-1\), not to a negative filter.</figcaption>
    <svg viewBox="0 0 760 330" role="img" aria-labelledby="rh-spectrum-title rh-spectrum-desc">
      <title id="rh-spectrum-title">Mixed-sign shaping of a head-tail spectrum</title>
      <desc id="rh-spectrum-desc">Tall leading bars represent a signal-rich spectral head and many short bars a weak tail. A filter curve is above the ridgeless level over the head and below it over lower modes, with a marked crossover.</desc>
      <line class="rh-axis" x1="68" y1="270" x2="710" y2="270"></line>
      <g class="rh-spectrum-bars" aria-hidden="true">
        <rect x="86" y="126" width="34" height="144"></rect><rect x="128" y="150" width="34" height="120"></rect><rect x="170" y="173" width="34" height="97"></rect>
        <rect class="tail" x="226" y="226" width="18" height="44"></rect><rect class="tail" x="251" y="232" width="18" height="38"></rect><rect class="tail" x="276" y="236" width="18" height="34"></rect><rect class="tail" x="301" y="239" width="18" height="31"></rect><rect class="tail" x="326" y="241" width="18" height="29"></rect><rect class="tail" x="351" y="243" width="18" height="27"></rect><rect class="tail" x="376" y="245" width="18" height="25"></rect><rect class="tail" x="401" y="247" width="18" height="23"></rect><rect class="tail" x="426" y="248" width="18" height="22"></rect><rect class="tail" x="451" y="249" width="18" height="21"></rect><rect class="tail" x="476" y="250" width="18" height="20"></rect><rect class="tail" x="501" y="251" width="18" height="19"></rect><rect class="tail" x="526" y="252" width="18" height="18"></rect><rect class="tail" x="551" y="253" width="18" height="17"></rect><rect class="tail" x="576" y="254" width="18" height="16"></rect><rect class="tail" x="601" y="255" width="18" height="15"></rect><rect class="tail" x="626" y="256" width="18" height="14"></rect><rect class="tail" x="651" y="257" width="18" height="13"></rect>
      </g>
      <line class="rh-ridgeless" x1="68" y1="82" x2="710" y2="82"></line>
      <path class="rh-shaping-path" d="M 82 48 C 142 45, 191 52, 232 71 S 312 106, 382 111 S 570 116, 694 120"></path>
      <line class="rh-crossover-line" x1="252" y1="50" x2="252" y2="270"></line>
      <circle class="rh-crossover-dot" cx="252" cy="82" r="5"></circle>
      <text class="rh-label" x="92" y="106">signal-rich head</text>
      <text class="rh-label" x="470" y="224">broad weak tail</text>
      <text class="rh-label" x="520" y="72">ridgeless f = 1</text>
      <text class="rh-label rh-blue-text" x="72" y="26">f(μ) − 1 &gt; 0: anti-shrinkage</text>
      <text class="rh-label rh-green-text" x="390" y="145">f(μ) − 1 &lt; 0: control</text>
      <text class="rh-label" x="260" y="101">single crossover</text>
      <text class="rh-axis-label" x="610" y="306">empirical spectrum</text>
    </svg>
  </figure>

  <aside class="rh-theory" aria-labelledby="rh-theory-title">
    <h3 id="rh-theory-title">What the theory establishes</h3>
    <ul>
      <li>In the common-spike Gaussian model, the explicit finite-time path achieves polynomial risk separation from every admissible stable negative-ridge endpoint under the paper’s scaling conditions.</li>
      <li>With a heterogeneous head and a general high-effective-rank tail, the tail trace determines the implicit floor while its squared spectrum controls finite exposure.</li>
      <li>The shifted operator is noncontractive; localized invariant-graph and Duhamel semigroup arguments control head-tail transfer.</li>
      <li>A finite-grid hold-out inequality connects the certified candidates to validation selection.</li>
    </ul>
  </aside>

</section>

## Networks and relational data

Many modern datasets describe relationships rather than independent observations. My work develops latent-space, covariate-assisted, dynamic, and spatial models for networks, with an emphasis on uncertainty quantification, robustness, and interpretable structure.

## Scalable Bayesian inference

I develop variational and approximate Bayesian methods for models where conventional posterior computation is too costly. The goal is to pair computational scalability with rigorous statistical guarantees.

## Multivariate and nonparametric Bayes

I am also interested in shrinkage priors, graphical models, dimension reduction, and Bayesian models that adapt to complex dependence without imposing unnecessarily rigid parametric structure.

## Current support

My research on **Graph Machine Learning** is supported by Microsoft Research (co-PI; 2026–present).

<script src="{{ '/assets/js/research-highlight.js' | relative_url }}" defer></script>
