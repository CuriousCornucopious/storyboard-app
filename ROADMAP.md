# Storyboard App - Roadmap

## Completed Features
- 5 ACTs × 3 Frames grid layout
- Status workflow (PENDING → COPIED → GENERATED → SHARED)
- Image uploads
- Link sharing (auto-detects YouTube/TikTok/etc.)
- Export (JSON/EDL/ZIP)
- Slideshow preview mode
- LocalStorage persistence

## Known Issues / Feedback (Batch for later fix)

### High Priority
1. **Slideshow modal won't close**
   - Modal is too large for browser window
   - No way to access the X button (offscreen)
   - Need: smaller modal OR scrollable OR close button always accessible

2. **Image data not persisting**
   - Text data saves fine on refresh
   - Uploaded images disappear after refresh
   - Need: Convert images to base64 for LocalStorage OR implement file handling differently

### Medium Priority
- [ ] Add close button to slideshow that works on mobile/small screens
- [ ] Make slideshow modal responsive/scollable
- [ ] Implement proper image persistence (base64 or alternative storage)

### Future Ideas
- [ ] Drag-and-drop reordering
- [ ] Act/frame duplication
- [ ] Cloud sync (when ready to expand beyond single-user)
- [ ] Collaborative editing (future expansion)

---

*Last updated: 2026-09-10*
