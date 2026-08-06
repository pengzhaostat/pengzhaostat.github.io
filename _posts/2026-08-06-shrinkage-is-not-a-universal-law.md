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

Of course, amplification also increases noise. This creates a simple competition between two quantities:

- the **missing-signal gain** obtained by compensating for unobserved signal;
- the **variance price** paid by amplifying training noise.

Our result gives the exact directional rule:

<div class="blog-equation" role="math" aria-label="Amplify direction i if and only if m i is greater than v i.">
\[
\boxed{m_i>v_i}
\quad\Longleftrightarrow\quad
\text{amplify direction } i.
\]
</div>

Here, <span class="blog-inline-math" role="math">\(m_i\)</span> is the covariance-aligned missing-signal gain and <span class="blog-inline-math" role="math">\(v_i\)</span> is the corresponding variance cost.

This is not a rejection of the bias–variance tradeoff. It is the bias–variance tradeoff with an important source of bias restored.

## When does classical shrinkage return?

In aligned settings, the missing-signal gain vanishes.

For example, if the population covariance is the identity, empirical row-space and null-space directions remain orthogonal for prediction. The gain <span class="blog-inline-math" role="math">\(m_i\)</span> is then zero, while amplification still carries a positive variance cost.

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
