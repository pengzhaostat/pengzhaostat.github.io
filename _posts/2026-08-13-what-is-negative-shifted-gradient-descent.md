---
layout: post
title: "What Is Negative-Shifted Gradient Descent—and Why Use It?"
date: 2026-08-13 23:30:00 -0400
description: A finite-time signed path can pass smoothly through the pole that constrains negative-ridge endpoints, producing head anti-shrinkage with controlled lower-spectrum exposure.
tags:
  - statistics
  - machine-learning
  - high-dimensional-statistics
  - optimization
  - spectral-regularization
  - gradient-descent
  - spectrum-crossing
  - deattenuation
  - anti-shrinkage
categories:
  - research
giscus_comments: false
---

<link rel="stylesheet" href="{{ '/assets/css/blog-post.css' | relative_url }}">

[Paper](https://arxiv.org/abs/2607.22474) · [alphaXiv](https://www.alphaxiv.org/abs/2607.22474) · [Code](https://github.com/pengzhaostat/mixed-sign-spectral-regularization) · [Interactive Research Highlight]({{ '/research/' | relative_url }}#negative-shifted-highlight)

Negative ridge suggests a natural way to undo excessive shrinkage: subtract a positive signed level before inversion so that attenuated modes receive more weight. But its endpoint has two structural problems. It has a pole, and its strongest amplification falls on the smallest stable eigenvalues.

Negative-shifted gradient descent (NS-GD) changes the question. Instead of converging to that endpoint, it stops along the path. At finite time, the would-be pole becomes removable, and the filter can anti-shrink a signal-rich head while keeping deep lower modes shrunk or exposure-controlled.

> **The endpoint has the useful sign, but the finite path has the useful shape.**

## Why negative ridge hits a wall

For an empirical eigenvalue \(\mu\), the negative-ridge endpoint acts relative to ridgeless regression through

<div class="blog-equation">
\[
A_\nu(\mu)=\frac{\mu}{\mu-\nu}.
\]
</div>

To define a stable endpoint over the entire positive empirical spectrum, the signed level must satisfy

<div class="blog-equation">
\[
0\leq \nu<\widehat\mu_{\min}^{+}.
\]
</div>

As \(\mu\) approaches \(\nu\) from above, \(A_\nu(\mu)\) diverges. Moreover,

<div class="blog-equation">
\[
A_\nu(\mu)-1=\frac{\nu}{\mu-\nu},
\]
</div>

so the endpoint gives its largest anti-shrinkage to the smallest stable modes. That is the wrong shape when the goal is to strengthen a signal-bearing head without paying uncontrolled lower-spectrum exposure.

This limitation becomes concrete in overparameterized random-design problems. Many weak tail directions can collectively create an implicit spectral floor beneath the predictive head. A useful floor-critical or supercritical signed level may then lie near or inside the empirical tail bulk, beyond the range available to a stable negative-ridge endpoint. This is the Marchenko–Pastur pole barrier.

## Stopping early removes the pole

To see the mechanism cleanly, consider the continuous-time idealization of NS-GD, which we call negative-shifted gradient flow (NS-GF). Let

<div class="blog-equation">
\[
S=\frac{X^\top X}{n},
\qquad
g=\frac{X^\top y}{n}.
\]
</div>

Starting from zero, the path follows

<div class="blog-equation">
\[
\dot\beta(t)=-(S-\nu I)\beta(t)+g,
\qquad
\beta(0)=0.
\]
</div>

On a positive empirical eigenmode \(\mu\), its multiplier relative to ridgeless regression is

<div class="blog-equation">
\[
\boxed{
f_{\nu,t}(\mu)
=
\frac{\mu}{\mu-\nu}
\left\{1-e^{-t(\mu-\nu)}\right\}.
}
\]
</div>

The apparent singularity cancels:

<div class="blog-equation">
\[
f_{\nu,t}(\nu)=\nu t.
\]
</div>

Thus the finite-time path remains smooth exactly where the endpoint diverges. The reference value is \(f=1\): values below one shrink relative to ridgeless, while values above one produce head anti-shrinkage.

The formula above is exact for continuous-time NS-GF. Discrete NS-GD is its controlled finite-step implementation under the paper's step-size conditions; it should not be read as an unrestricted exact equivalence.

<figure class="blog-figure">
  <a href="{{ '/assets/img/nsgd_endpoint_finite_path.png' | relative_url }}" aria-label="Open the full-resolution endpoint-versus-finite-path spectral-filter figure">
    <img src="{{ '/assets/img/nsgd_endpoint_finite_path.png' | relative_url }}" alt="A spectral-filter plot with empirical eigenvalue mu increasing from tail to head. A dashed red negative-ridge endpoint rises toward a pole at mu equals nu and is tail-heavy on its stable branch. A blue finite-time negative-shifted path is smooth at the would-be pole, lies below the ridgeless level on lower modes, crosses f equals one, and lies above ridgeless on leading head modes." loading="lazy" width="1448" height="924">
  </a>
  <figcaption><strong>Endpoint versus finite path.</strong> The dashed endpoint branch is tail-heavy and diverges at \(\mu=\nu\); a globally stable endpoint would have to place this pole below the entire positive empirical spectrum. The finite-time path has the removable value \(f_{\nu,t}(\nu)=\nu t\). For the displayed pair \((\nu,t)\), it remains below ridgeless on lower modes and crosses above one on a signal-rich leading region. With \(\nu\) fixed, \(t\) moves the displayed crossover; in general, the crossing is determined jointly by \((\nu,t)\). The blue curve is the continuous-time idealization of the finite-step NS-GD path.</figcaption>
</figure>

For an interactive version of the filter—and a separate illustration of the Marchenko–Pastur barrier—see the [Research Highlight]({{ '/research/' | relative_url }}#negative-shifted-highlight).

## Spectrum crossing: one path, two regularization signs

The figure contains two different boundaries.

- The point \(\mu=\nu\) is the would-be endpoint pole and separates contracting from growing dynamics.
- The point where \(f_{\nu,t}(\mu)=1\) separates shrinkage from anti-shrinkage relative to ridgeless regression.

We use **spectrum crossing** for the second phenomenon: as \(\mu\) increases, the finite-time filter crosses the ridgeless level and the sign of \(f_{\nu,t}(\mu)-1\) changes.

These points need not coincide. In particular, placing a mode on the growing side of the dynamics does not automatically put its finite-time filter above one. At a selected stopping time, deep lower modes may still be shrunk or exposure-controlled even while a signal-rich leading region has crossed above ridgeless.

This is **mixed-sign spectral regularization**. The sign refers to \(f_{\nu,t}(\mu)-1\): negative means shrinkage, positive means anti-shrinkage. For the continuous-time filter, the above-ridgeless modes form a leading spectral prefix, and its crossing boundary is set jointly by the signed level and stopping time.

The two parameters therefore play different roles. The signed level \(\nu\) sets the pole location and the noncontractive scale; \(t\) limits exposure along the path and, together with \(\nu\), determines which modes cross ridgeless.

## Early stopping is the regularizer

Some directions of the negative-shifted dynamics would diverge if the method ran forever. But convergence is not the statistical objective; prediction risk is.

> **Can a trajectory that is asymptotically unstable pass through a statistically better estimator at finite time?**

The answer depends on the same bias–variance comparison that governs deattenuation more broadly. Anti-shrinkage can recover signal that sampling geometry or implicit regularization has attenuated, but it also increases noise and lower-spectrum exposure. The path is useful only while the recovered-signal gain exceeds that variance price.

This is why the stopping time is not an implementation detail. **It is the regularizer.** Validation over a finite grid of \((\nu,t)\) values chooses an implementation, while the theory identifies regimes in which the resulting finite exposure is controlled.

For the prediction geometry behind this comparison, see [Shrinkage Is Not a Universal Law]({% post_url 2026-08-06-shrinkage-is-not-a-universal-law %}).

## Takeaway

NS-GD does not try to compute an unstable negative-ridge solution. It uses the same signed direction without taking the endpoint:

> **The negative-ridge endpoint is pole-constrained and tail-heavy. The stopped path removes the pole, changes the filter shape, and can combine head anti-shrinkage with controlled lower-spectrum exposure.**

That is why finite time matters. The goal is not instability for its own sake, but selective deattenuation before the variance price becomes too large.
