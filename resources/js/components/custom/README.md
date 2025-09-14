# WYSIWYG Component

A rich text editor component built with Tiptap and React, designed to integrate seamlessly with the MakeShift application.

## Features

- **Rich Text Formatting**: Bold, italic, underline, strikethrough, and code formatting
- **Headings**: Support for H1, H2, and H3 headings
- **Lists**: Bullet lists and numbered lists
- **Blocks**: Blockquotes and code blocks
- **User Experience**: Floating menu, bubble menu, undo/redo functionality
- **Customizable**: Configurable height, styling, and extensions
- **Accessible**: Built with accessibility in mind using Radix UI components

## Installation

The component uses the following dependencies that are already installed in the project:

```json
{
  "@tiptap/react": "^3.4.2",
  "@tiptap/pm": "^3.4.2",
  "@tiptap/starter-kit": "^3.4.2"
}
```

## Basic Usage

```tsx
import { Wysiwyg } from '@/components/custom/wysiwyg'

function MyComponent() {
  const [content, setContent] = useState('<p>Hello World!</p>')

  return (
    <Wysiwyg
      content={content}
      onChange={setContent}
      minHeight="200px"
      maxHeight="400px"
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | `''` | Initial HTML content |
| `onChange` | `(content: string) => void` | - | Callback when content changes |
| `className` | `string` | - | Additional CSS classes for the container |
| `editorClassName` | `string` | - | Additional CSS classes for the editor |
| `toolbarClassName` | `string` | - | Additional CSS classes for the toolbar |
| `disabled` | `boolean` | `false` | Whether the editor is disabled |
| `minHeight` | `string` | `'200px'` | Minimum height of the editor |
| `maxHeight` | `string` | `'400px'` | Maximum height of the editor |
| `showFloatingMenu` | `boolean` | `true` | Whether to show the floating menu |
| `showBubbleMenu` | `boolean` | `true` | Whether to show the bubble menu |
| `extensions` | `Extension[]` | `[]` | Additional Tiptap extensions |
| `editorProps` | `Record<string, unknown>` | `{}` | Additional editor properties |

## Advanced Usage

### With Form Integration

```tsx
import { WysiwygExample } from '@/components/custom/wysiwyg-example'

function MyForm() {
  const [content, setContent] = useState('')

  return (
    <WysiwygExample
      initialContent={content}
      onSave={setContent}
      label="Article Content"
      required
    />
  )
}
```

### With Custom Extensions

```tsx
import { Wysiwyg } from '@/components/custom/wysiwyg'
import TextAlign from '@tiptap/extension-text-align'

function MyComponent() {
  return (
    <Wysiwyg
      content="<p>Hello World!</p>"
      onChange={(content) => console.log(content)}
      extensions={[
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
      ]}
    />
  )
}
```

### With Custom Styling

```tsx
<Wysiwyg
  content="<p>Hello World!</p>"
  onChange={setContent}
  className="my-custom-wrapper"
  editorClassName="my-custom-editor"
  toolbarClassName="my-custom-toolbar"
  minHeight="300px"
  maxHeight="600px"
/>
```

## Demo

Visit `/demo/wysiwyg` to see the component in action with interactive examples.

## Keyboard Shortcuts

The component supports standard keyboard shortcuts:

- **Ctrl/Cmd + B**: Bold
- **Ctrl/Cmd + I**: Italic
- **Ctrl/Cmd + U**: Underline
- **Ctrl/Cmd + Z**: Undo
- **Ctrl/Cmd + Y**: Redo
- **Ctrl/Cmd + Shift + 8**: Bullet list
- **Ctrl/Cmd + Shift + 7**: Numbered list
- **Ctrl/Cmd + Shift + >**: Blockquote

## Styling

The component uses Tailwind CSS classes and follows the project's design system. It automatically adapts to light/dark themes and respects the application's color scheme.

## Accessibility

The component is built with accessibility in mind:

- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management

## Browser Support

The component supports all modern browsers that support React 19 and the features used by Tiptap.

## Troubleshooting

### Common Issues

1. **Editor not rendering**: Make sure all required dependencies are installed
2. **Styling issues**: Check that Tailwind CSS is properly configured
3. **TypeScript errors**: Ensure proper type imports are used

### Getting Help

If you encounter issues, check the Tiptap documentation or the component's source code for more details.
