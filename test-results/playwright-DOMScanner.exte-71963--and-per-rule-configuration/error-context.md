# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - button "Button" [ref=e3]
    - link "Skip to main" [ref=e4] [cursor=pointer]:
      - /url: "#main"
    - button "No Focus" [ref=e5]
    - button "Has Focus" [ref=e6]
    - navigation
    - main
    - generic [ref=e7]: Low Contrast
    - generic [ref=e8]: Good Contrast
  - generic [ref=e9]: Config
```