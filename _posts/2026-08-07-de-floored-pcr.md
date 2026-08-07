---
layout: post
title: "The Spectrum Was Known to Be Biased. Why Did PCR Keep Inverting It?"
date: 2026-08-07 00:00:00 -0400
description: Covariance estimation learned to correct the distorted high-dimensional sample spectrum; principal component regression kept inverting it. De-floored PCR removes the endogenous spectral floor before inversion — in the regime where it is large enough to matter yet cheap to remove.
tags:
  - statistics
  - machine-learning
  - high-dimensional-statistics
  - random-matrix-theory
categories:
  - research
giscus_comments: false
---

<link rel="stylesheet" href="{{ '/assets/css/blog-post.css' | relative_url }}">

Principal component regression (PCR) is one of the oldest and simplest forms of spectral regularization. Compute the empirical principal components, keep the leading ones, discard the rest, and perform regression in the retained subspace.

This creates a familiar question:

> How many principal components should we keep?

For decades, this cutoff has been treated as the main regularization decision in PCR. But high-dimensional random-matrix theory has taught us something equally fundamental:

> The empirical eigenvalues themselves can be systematically distorted.

Covariance-estimation theory responded to this fact by developing increasingly sophisticated ways to shrink, debias, or otherwise correct empirical spectra.

PCR usually did something different. It kept the distorted eigenvalues—and inverted them.

Our recent paper on de-floored principal component regression (dPCR) starts from this simple mismatch.

## But PCR is an inverse problem

Here is where something interesting happens.

<p>Suppose a predictive population component has spectral scale \(s_i\), but high-dimensional random design inflates its empirical denominator to approximately</p>

<div class="blog-equation">\[ s_i + a. \]</div>

For covariance estimation, seeing an eigenvalue that is too large naturally suggests correcting it downward. But regression uses the eigenvalue in the *denominator*.

<p>Ordinary PCR effectively applies the inverse weight \(1/(s_i+a)\), so the resulting signal multiplier is approximately</p>

<div class="blog-equation">\[ \frac{s_i}{s_i+a} < 1. \]</div>

So the same upward spectral distortion that covariance estimation tries to remove becomes downward attenuation of the regression signal after inversion.

<p>Correcting \(s_i+a \longrightarrow s_i\) means changing the regression weight from</p>

<div class="blog-equation">\[ \frac{1}{s_i+a} \quad\longrightarrow\quad \frac{1}{s_i}. \]</div>

In other words:

> Shrinking an inflated covariance eigenvalue corresponds to anti-shrinking the associated regression coefficient.

This inversion changes the statistical interpretation completely.

## Standard PCR regularizes the support, not the retained denominators

Classical spectral cutoff methods solve instability by changing which singular directions are used.

<p>A retained empirical component receives its ordinary inverse weight \(1/\widehat\mu_i\), while a discarded component receives weight zero. PCR therefore has a binary spectral decision:</p>

<div class="blog-equation">\[ \frac{1}{\widehat\mu_i} \qquad\text{or}\qquad 0. \]</div>

<p>What it does not normally ask is whether the retained empirical eigenvalue \(\widehat\mu_i\) itself contains a systematic nuisance component that should be removed before inversion. This distinction is explicit in our paper: ordinary spectral cutoff changes the <em>support</em> of the inverse filter, whereas dPCR changes the <em>denominators</em> within the retained range.</p>

That matters because no rank choice can repair a wrong denominator. If a predictive component is retained, PCR inherits its attenuation. If it is discarded, PCR loses the component entirely. Neither choice produces the correct inverse weight.

## When does self-induced regularization become over-regularization?

<p>Suppose the covariance has a predictive head and a very large collection of individually weak tail directions. Write the sample-space Gram matrix schematically as</p>

<div class="blog-equation">\[ K = K_H + K_T. \]</div>

<p>When the tail has sufficiently high effective dimension, \(K_T \approx a\,I_n\), where</p>

<div class="blog-equation">\[ a = \frac{1}{n}\sum_{j>h}\lambda_j. \]</div>

<p>The tail therefore creates a nearly scalar spectral floor underneath the predictive head, and a head component with clean scale \(s_i\) appears roughly at \(s_i+a\).</p>

<p>If \(a \ll s_i\), the attenuation \(s_i/(s_i+a)\) is negligible. This is effectively the strong-signal regime. The floor may be visible spectrally but does not matter at first order for prediction. This helps explain why the correction is absent from much traditional theory: assumptions that make the signal sufficiently strong also make the floor-induced bias asymptotically irrelevant.</p>

<p>But consider instead the matched regime \(a \asymp s_i\). Now \(s_i/(s_i+a)\) is bounded away from one. The implicit shrinkage is no longer a small perturbation—it creates first-order prediction bias.</p>

The question becomes:

> Can we remove this floor without paying an equally large variance price?

## First spectral mass creates the bias; squared spectral mass determines the price

This is the key structural result of the paper.

<p>Define</p>

<div class="blog-equation">\[ T_1 = \sum_{j>h}\lambda_j, \qquad T_2 = \sum_{j>h}\lambda_j^2. \]</div>

<p>The spectral floor is generated by the first tail mass, \(a = T_1/n\), so its squared attenuation effect is governed by \(T_1^2\). But the clean prediction cost associated with the tail after correction is controlled by the squared tail mass \(T_2\). Our exact risk decomposition separates precisely these two quantities: first spectral mass controls denominator inflation, while squared spectral mass controls the clean prediction cost of correction.</p>

<p>This opens a regime that is easy to miss if one thinks only in terms of "large" or "small" tails. A tail can simultaneously have \(T_1\) large and \(T_2\) relatively small. The relevant condition is</p>

<div class="blog-equation">\[ T_1^2 \gg n\,T_2. \]</div>

<p>Equivalently, its effective dimension \(d_{\mathrm{eff}} = T_1^2/T_2\) satisfies \(d_{\mathrm{eff}} \gg n\). This is the central asymmetry:</p>

> Many individually weak directions add coherently to create a large common spectral floor, but their prediction cost accumulates only through squared spectral mass.

The floor can therefore be large enough to matter while remaining cheap to remove.

## De-floored PCR

<p>dPCR makes the simplest possible correction. Where ordinary PCR uses \(1/\widehat\mu_i\) on retained components, dPCR uses</p>

<div class="blog-equation">\[ \frac{1}{\widehat\mu_i - a_0}, \]</div>

<p>where \(a_0\) estimates the spectral floor. Rank and floor correction play different roles:</p>

- the **rank** determines which empirical directions are trusted;
- the **floor correction** determines how strongly the trusted directions should be inverted.

In the sharp-floor regime, the floor can be estimated from the same empirical spectrum using the lower spectral cluster. Our theory shows that this plug-in correction attains the oracle dPCR rate at a prespecified retained rank. More importantly, in the matched sharp-floor asymptotic regime, the prediction risk of dPCR becomes negligible relative to the best ordinary PCR risk over *all possible ranks*. This targets the sharp-floor regime specifically: in the ordinary proportional Marchenko–Pastur bulk, where the spectrum has persistent relative width, a single scalar correction is not enough.

So the gain cannot be explained by better rank selection.

> The missing regularization axis is denominator correction.

## A familiar phenomenon viewed through an inverse

This is perhaps the most interesting part of the story. Random-matrix theory and covariance estimation both told us the empirical spectrum is distorted and worth correcting.

<p>PCR nevertheless continued to use those eigenvalues primarily through a spectral cutoff: retain \(1/\widehat\mu_i\), or replace it by zero.</p>

Our result suggests another possibility:

> Before inverting an empirical eigenvalue, ask whether part of it is an endogenous spectral floor that should not be there.

The same spectral inflation that looks like a covariance-estimation error becomes a coefficient attenuation after inversion. And the same high-dimensional tail that looks like beneficial implicit regularization in one regime can become removable over-regularization in another.

That leads to a broader statistical principle:

> A regularization effect should not be judged only by how much variance it removes. We should also ask what systematic bias it creates, whether that bias is identifiable, and whether removing it costs less than leaving it in place.

For dPCR, that comparison has an unusually clean form:

<div class="blog-equation">\[ \boxed{\begin{array}{c} \text{first spectral mass creates the floor;} \\[3pt] \text{squared spectral mass determines its correction cost.} \end{array}} \]</div>

The spectral floor was not unknown. What was missing was the regime in which, after inversion, it becomes a first-order but cheaply removable prediction bias.

Paper: [_De-floored Principal Component Regression: When Rank Selection Alone Is Insufficient for Prediction_](https://arxiv.org/abs/2607.16638).
