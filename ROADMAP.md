# Storyboard App - Unified Roadmap

**Created:** 2026-09-10
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
| Slideshow preview mode | ⚠️ Broken | 2026-09-10 |
| LocalStorage persistence | ⚠️ Partial | 2026-09-10 |

**Live URL:** https://storyboard-app-jade.vercel.app
**GitHub:** https://github.com/CuriousCornucopious/storyboard-app

---

## 🚨 KNOWN ISSUES (Batch Fix - Next Session)

| Issue | Description | Priority |
|-------|-------------|----------|
| **Slideshow won't close** | Modal too large, X button inaccessible | HIGH |
| **Images don't persist** | Text saves, uploaded images vanish on refresh | HIGH |

---

## 📋 NEXT SESSION - START HERE

### Todo List:
1. Fix slideshow modal - make scrollable OR add fixed close button
2. Fix image persistence - convert to base64 OR alternative storage
3. Deploy fixes to Vercel

### After Fixes - Future Features:
- AI Prompt Generator (text-only helper for users without AI access)
- Drag-and-drop reordering
- Act/frame duplication

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

*Last consolidated: 2026-09-10*
