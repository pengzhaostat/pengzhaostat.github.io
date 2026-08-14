---
layout: post
title: Shrinkage Is Not a Universal Law
date: 2026-08-06 00:00:00 -0400
description: Why anisotropic prediction geometry can make expansion, rather than shrinkage, the right correction in overparameterized regression.
tags:
  - statistics
  - machine-learning
  - high-dimensional-statistics
categories:
  - research
giscus_comments: false
---

<link rel="stylesheet" href="{{ '/assets/css/blog-post.css' | relative_url }}">

[Paper](https://arxiv.org/abs/2607.22474) · [alphaXiv](https://www.alphaxiv.org/abs/2607.22474) · [Code](https://github.com/pengzhaostat/mixed-sign-spectral-regularization)

One of the most famous lessons in statistics comes from the James–Stein phenomenon: when estimating many noisy quantities, pulling the estimates toward zero can reduce their total error.

That discovery helped make **shrinkage** a central principle of modern statistics and machine learning. Ridge regression, regularization, weight decay, early stopping, and many Bayesian estimators are all built around a similar intuition:

> A slightly biased but less variable estimate can outperform an unbiased one.

This principle is powerful. But the popular slogan it inspired—“when estimates are noisy, shrink them”—is not a universal law.

In overparameterized prediction, sometimes the correct action is the opposite:

> **Some directions should be expanded rather than shrunk.**

## The missing part of the classical bias–variance story

Consider linear regression with more parameters than observations. The training data can identify only the component of the true signal lying in the empirical row space of the design matrix. Another component remains in the empirical null space and is invisible to the training loss.

The minimum-norm, or ridgeless, estimator sets this unobserved component to zero.

In ordinary Euclidean geometry, the empirical row space and null space are orthogonal. This may suggest that increasing a fitted row-space coefficient cannot help recover signal in the null space.

But prediction error is not necessarily measured in Euclidean geometry. It is measured using the population covariance of future predictors.

When that population covariance is anisotropic, two directions that are orthogonal in the training geometry need not be orthogonal for prediction. A direction visible in the training data may therefore act as a proxy for signal hidden in the empirical null space.

Increasing its fitted coefficient can improve test prediction.

<figure class="blog-figure">
  <img src="{{ '/assets/img/shrink_expand_schematic.png' | relative_url }}" alt="Two side-by-side contour plots. Left, Training geometry (Euclidean): concentric circular contours; the true signal beta-star sits at (1,1), the ridgeless estimate is its projection at (1,0) on the observed axis, and the note says the projection is optimal, do not amplify. Right, Prediction geometry (Sigma): tilted elliptical contours; a red amplify arrow pushes the estimate from (1,0) to an expanded optimum at (1.8,0), past the projection, because the observed axis now proxies the hidden signal." loading="lazy" width="1845" height="933">
  <figcaption><strong>Two geometries, two verdicts.</strong> The training loss pins down only the observed (row-space) coordinate; the hidden (null-space) coordinate of the true signal \(\beta^\star\) is invisible to it. <strong>Left:</strong> under isotropic (Euclidean) prediction geometry the axes stay orthogonal, so the ridgeless projection is already optimal — amplifying it only buys variance. <strong>Right:</strong> under an anisotropic population covariance \(\Sigma\) the axes tilt, the observed direction becomes a proxy for the hidden signal, and the risk-minimizing point sits <em>past</em> the projection. Expansion, not shrinkage, is the correct move.</figcaption>
</figure>

Of course, amplification also increases noise. For each direction, this creates a simple competition between two quantities:

<p class="blog-math-def">\(m_i\) — the <strong>missing-signal gain</strong>: how much amplifying the observed coordinate recovers of the hidden null-space signal, measured in the population-covariance geometry.</p>
<p class="blog-math-def">\(v_i\) — the <strong>variance price</strong>: the extra estimation noise the same amplification injects.</p>

Our result gives an exact, direction-by-direction rule — amplify exactly when the gain beats the price:

<div class="blog-equation" role="math" aria-label="Amplify direction i if and only if m i is greater than v i.">
\[
\boxed{\,m_i > v_i\,}
\quad\Longleftrightarrow\quad
\text{amplify direction } i.
\]
</div>

This is not a rejection of the bias–variance tradeoff. It is the bias–variance tradeoff with an important source of bias restored.

<figure class="blog-figure">
  <img src="{{ '/assets/img/amplification_rule_mv.png' | relative_url }}" alt="A per-mode plot on a symmetric-log vertical axis versus empirical eigenmode rank from 1 to 200. A red curve, the missing-signal gain m_i, starts high on the left and decays; a blue curve, the variance price v_i, is roughly flat then rises on the right. On the leading modes m_i exceeds v_i and the gap is shaded as an amplify shell; the curves cross near rank 54, after which v_i exceeds m_i in the shrink regime. A pink band shows the 10 to 90 percent range across design draws." loading="lazy" width="1579" height="929">
  <figcaption><strong>The rule, mode by mode.</strong> For a spike-plus-flat \(\Sigma\) with signal in the high-variance directions, the missing-signal gain \(m_i\) (red) beats the variance price \(v_i\) (blue) on the leading modes, opening an <em>amplify</em> shell (shaded) where the optimal spectral filter is pushed above one; past the crossover (here \(\approx\) rank 54) the ordinary shrink regime returns. Under isotropic \(\Sigma\) every \(m_i \equiv 0\), the shell is empty, and classical shrinkage is recovered.</figcaption>
</figure>

## When does classical shrinkage return?

In aligned settings, the missing-signal gain vanishes.

<p>For example, if the population covariance is the identity, empirical row-space and null-space directions remain orthogonal for prediction. The gain \(m_i\) is then zero, while amplification still carries a positive variance cost.</p>

The classical shrinkage conclusion is recovered.

Likewise, if risk is measured using the empirical training geometry, the null-space signal contributes nothing to that risk. If the design has full column rank, there is no empirical null-space signal to compensate for.

The classical setting is therefore not wrong. It is a special geometry in which the benefit of anti-shrinkage has been removed.

## A broader statistical rule

The general lesson is therefore not:

> Always shrink.

Nor is it:

> Always anti-shrink.

The more complete rule is:

> **Shrink when the variance saving exceeds the lost signal. Expand when the missing-signal gain exceeds the variance price.**

James–Stein revealed that unbiasedness is not always optimal.

The overparameterized prediction setting reveals a complementary fact: shrinkage itself is not always optimal.

The right decision depends on the geometry of what the data observe, the geometry in which performance is evaluated, and where the signal is located.

Paper: [_Beyond Negative-Ridge Endpoints: Mixed-Sign Spectral Regularization via Negative-Shifted Gradient Descent_](https://arxiv.org/abs/2607.22474).
