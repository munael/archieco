Day x:

Q: p5 canvas resizes correctly if size increases in one step. Does not resize if it decreases in the same step.

A: Sprinkle:

```css
min-height: 0;
min-width: 0;
```

on container and child, and

```css
overflow: hidden
```

on child.

Q: Height keeps increasing on smooth resize.

A: Add `line-height: 0` to canvas parent. Don't ask.