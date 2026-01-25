# Combined Test: Mermaid + MathJax

## Flowchart with Math Reference

```mermaid
flowchart LR
    A[Input x] --> B[Compute]
    B --> C[Output y]
```

The relationship between x and y is: $y = f(x) = x^2 + 2x + 1$

## Math Formulas

Euler's identity: $e^{i\pi} + 1 = 0$

$$\frac{d}{dx}\left(\int_a^x f(t)dt\right) = f(x)$$

## Another Diagram

```mermaid
sequenceDiagram
    Math->>MathJax: Parse TeX
    MathJax-->>Math: SVG output
```

This demonstrates that both Mermaid diagrams and MathJax formulas can coexist on the same page.
