import { ClassicEditor as ClassicEditorBase } from '@ckeditor/ckeditor5-editor-classic';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import { Bold, Italic, Underline, Strikethrough, Code } from '@ckeditor/ckeditor5-basic-styles';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { Link } from '@ckeditor/ckeditor5-link';
import { List, TodoList } from '@ckeditor/ckeditor5-list';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { Image, ImageToolbar, ImageCaption, ImageStyle, ImageResize } from '@ckeditor/ckeditor5-image';
import { Table, TableToolbar } from '@ckeditor/ckeditor5-table';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { CodeBlock } from '@ckeditor/ckeditor5-code-block';
import { Font, FontSize, FontColor, FontBackgroundColor } from '@ckeditor/ckeditor5-font';
import { Highlight } from '@ckeditor/ckeditor5-highlight';
import { Indent, IndentBlock } from '@ckeditor/ckeditor5-indent';
import { HorizontalLine } from '@ckeditor/ckeditor5-horizontal-line';
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office';
import { SpecialCharacters, SpecialCharactersEssentials } from '@ckeditor/ckeditor5-special-characters';
import { WordCount } from '@ckeditor/ckeditor5-word-count';
import { Undo } from '@ckeditor/ckeditor5-undo';
import { Clipboard } from '@ckeditor/ckeditor5-clipboard';
import { FindAndReplace } from '@ckeditor/ckeditor5-find-and-replace';
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing';
import { RemoveFormat } from '@ckeditor/ckeditor5-remove-format';

export default class ClassicEditor extends ClassicEditorBase {}

ClassicEditor.builtinPlugins = [
  Essentials,
  Autoformat,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  BlockQuote,
  Heading,
  Link,
  List,
  TodoList,
  Paragraph,
  Alignment,
  Image,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  ImageResize,
  Table,
  TableToolbar,
  MediaEmbed,
  CodeBlock,
  Font,
  FontSize,
  FontColor,
  FontBackgroundColor,
  Highlight,
  Indent,
  IndentBlock,
  HorizontalLine,
  PasteFromOffice,
  SpecialCharacters,
  SpecialCharactersEssentials,
  WordCount,
  Undo,
  Clipboard,
  FindAndReplace,
  SourceEditing,
  RemoveFormat,
];

ClassicEditor.defaultConfig = {
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'code',
      'link',
      'bulletedList',
      'numberedList',
      'todoList',
      '|',
      'alignment',
      'indent',
      'outdent',
      'blockQuote',
      'horizontalLine',
      'imageUpload',
      'mediaEmbed',
      'insertTable',
      'codeBlock',
      '|',
      'fontSize',
      'fontColor',
      'fontBackgroundColor',
      'highlight',
      'undo',
      'redo',
      'specialCharacters',
      'findAndReplace',
      'sourceEditing',
      'removeFormat',
    ],
  },
  image: {
    toolbar: ['imageStyle:full', 'imageStyle:side', '|', 'imageTextAlternative', 'imageCaption'],
    // Define the image styles using objects
    // styles: [
    //   {
    //     name: "full",
    //     title: "Full width",
    //     icon: "full",
    //     className: "image-style-full", // Add the class to the image
    //   },
    //   {
    //     name: "side",
    //     title: "Side",
    //     icon: "side",
    //     className: "image-style-side", // Add the class to the image
    //   },
    // ],
    resizeOptions: [
      {
        name: 'resizeImage:original',
        value: null,
        icon: 'original',
      },
      {
        name: 'resizeImage:50',
        value: '50',
        icon: 'medium',
      },
      {
        name: 'resizeImage:75',
        value: '75',
        icon: 'large',
      },
    ],
  },
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
  },
  mediaEmbed: {
    previewsInData: true,
  },
  language: 'en',
  fontSize: {
    options: ['tiny', 'small', 'default', 'big', 'huge'],
    supportAllValues: false,
  },
  fontColor: {
    columns: 5,
    documentColors: 10,
  },
  fontBackgroundColor: {
    columns: 5,
    documentColors: 10,
  },
  wordCount: {
    onUpdate: (stats) => {
      console.log(`Characters: ${stats.characters}, Words: ${stats.words}`);
    },
  },
};
