---
title: "Grandmaster Auto-EDA, Agentic Feature Engineering & Optuna Hill-Climbing Ensemble"
category: "kaggle-competition"
platform: "kaggle"
gpu_required: "Kaggle P100 or Dual T4 GPU"
vram_gb: 16
base_model: "LightGBM + CatBoost + XGBoost + RealMLP + TabNet Stack"
method: "5-Fold Stratified OOF + Optuna Bayesian Sweep + Nelder-Mead / Hill-Climbing Blender"
pricing: "free"
price_usd: 0
kaggle_url: "https://www.kaggle.com/code"
keep_alive_included: true
summary: "Competition-winning tabular & multimodal Kaggle playbook: automated adversarial validation, target encoding without leakage, GPU-accelerated GBDT + neural OOF generation, and hill-climbing ensemble blending."
tags: ["kaggle", "competition", "optuna", "lightgbm", "catboost", "xgboost", "ensembling", "stacking"]
run_steps:
  - "Attach your Kaggle competition dataset in `/kaggle/input/` and set `TARGET_COL` and `METRIC` (`roc_auc`, `rmse`, `logloss`, `qwk`) in Cell 1."
  - "Run Cell 2 for Adversarial Validation (detects train/test distribution drift and drops leaking timestamp/ID features)."
  - "Run Cell 3 to generate out-of-fold (OOF) interaction features, frequency encodings, and group aggregations inside strict CV folds."
  - "Run Cell 4 to train GPU-accelerated LightGBM, CatBoost, XGBoost, and RealMLP models, saving all `oof_preds.npy` and `test_preds.npy`."
  - "Run Cell 5 (Hill-Climbing OOF Blender) to find the optimal non-negative / Ridge weights that maximize CV and output `submission.csv`."
data_sources:
  - "https://www.kaggle.com/competitions"
updated: "2026-11-01"
---

## The Reproducible Architecture Behind Top-1% Kaggle Finishes

In March 2026, autonomous multi-agent competition systems proved that **disciplined cross-validation + systematic OOF ensembling** consistently beats manual trial-and-error. This notebook packages that exact workflow into a single reusable template:

| Stage | Technique | Typical LB Gain |
| :--- | :--- | :--- |
| **1. Adversarial CV Check** | Train LightGBM to distinguish `is_test=1` vs `is_test=0` (target AUC ≈ 0.50) | Prevents 0.015+ private LB shakeup |
| **2. Out-of-Fold Target Stats** | Nested M-estimate target encoding (`mean`, `std`, `skew`, `min/max`) | `+0.004 to +0.012` CV |
| **3. Model Diversity** | GBDTs (LightGBM/CatBoost/XGBoost) + Neural (`RealMLP` / `TabNet`) | Uncorrelated error residuals |
| **4. Hill-Climbing Blender** | Greedy coordinate ascent on OOF predictions with shrinkage | `+0.002 to +0.006` over best single model |

