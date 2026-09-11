# Storyboard App - Unified Roadmap

**Created:** 2026-09-10
**Updated:** 2026-09-11
**Purpose:** Visual storyboard tool for multi-shot video/AI generation projects

---

## ✅ COMPLETED (Working Now)

| Feature | Status | Date Completed |
|---------|--------|----------------|
| 5 ACTs × 3 Frames grid layout | ✅ Working | 2026-09-10 |
| Status workflow (PENDING→COPIED→GENERATED→SHARED) | ✅ Working | 2026-09-10 |
| Image uploads | ✅ Working | 2026-09-10 |
| Link sharing (auto-detects YouTube/TikTok/etc.) | ✅ Working | 2026-09-10 |
| Export (JSON/EDL/ZIP) | ✅ Working | 2026-09-10 |
| Slideshow preview mode | ✅ Fixed | 2026-09-10 |
| LocalStorage persistence | ✅ Fixed | 2026-09-10 |

**Live URL:** https://storyboard-app-jade.vercel.app
**GitHub:** https://github.com/CuriousCornucopious/storyboard-app

---

## 🚨 KNOWN ISSUES (Batch Fix - Next Session)

| Issue | Description | Priority |
|-------|-------------|----------|
| **New story loses photos** | Photos persist within a story but not when creating new story. Need import/duplicate frame feature. | MEDIUM |

---

## 📋 NEXT SESSION - START HERE

### Todo List:
1. Fix "new story loses photos" - add import/duplicate frame feature
2. Deploy to Vercel if not already current

### Future Features (Post-Fix):
- AI Prompt Generator (text-only helper for users without AI access)
- Drag-and-drop reordering
- Act/frame duplication

---

## 💡 SaaS Discussion (2026-09-11)

**What is SaaS?**
Software as a Service — cloud-hosted, subscription-based. Users pay to access via URL instead of downloading code.

**Implications:**
- If we build a SaaS version, the interface will likely change significantly (new login, accounts, billing UI)
- **Stick figure demo idea:** Might not be worthwhile to create a teaching guide showing current interface, since SaaS version would look different

**Decision needed:**
- Option A: Keep current app as free/open-source tool, focus on other projects
- Option B: Build SaaS version (requires: user accounts, Stripe/payment, custom domain, significant redesign)

---

## 📖 Original Vision (Reference)

**Grid System:**
- Horizontal (Left→Right): Acts
- Vertical (Top↓Bottom): Frames
- Move RIGHT when shot is locked, UP/DOWN to elaborate

**Status Flow:**
- PENDING → COPIED (when prompt copied) → GENERATED (when image uploaded) → SHARED (when link added)

**Views:**
- Collapsed: Grid of act cards + slideshow
- Expanded: All frames in act, vertically stacked

---

*Last consolidated: 2026-09-11*
