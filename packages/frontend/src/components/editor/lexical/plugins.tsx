import { useState } from "react"
import { createPortal } from "react-dom"
import {
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  MULTILINE_ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
} from "@lexical/markdown"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin"
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin"
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin"
import { TablePlugin } from "@lexical/react/LexicalTablePlugin"
import { ContentEditable } from "@/components/editor/lexical/ui/content-editable"
import { ActionsPlugin } from "@/components/editor/lexical/plugins/actions/actions-plugin"
import { ClearEditorActionPlugin } from "@/components/editor/lexical/plugins/actions/clear-editor-plugin"
import { CounterCharacterPlugin } from "@/components/editor/lexical/plugins/actions/counter-character-plugin"
import { EditModeTogglePlugin } from "@/components/editor/lexical/plugins/actions/edit-mode-toggle-plugin"
import { ImportExportPlugin } from "@/components/editor/lexical/plugins/actions/import-export-plugin"
import { MarkdownTogglePlugin } from "@/components/editor/lexical/plugins/actions/markdown-toggle-plugin"
import { ShareContentPlugin } from "@/components/editor/lexical/plugins/actions/share-content-plugin"
import { TreeViewPlugin } from "@/components/editor/lexical/plugins/actions/tree-view-plugin"
import { AutoLinkPlugin } from "@/components/editor/lexical/plugins/auto-link-plugin"
import { AutocompletePlugin } from "@/components/editor/lexical/plugins/autocomplete-plugin"
import { CodeActionMenuPlugin } from "@/components/editor/lexical/plugins/code-action-menu-plugin"
import { CodeHighlightPlugin } from "@/components/editor/lexical/plugins/code-highlight-plugin"
import { CollapsiblePlugin } from "@/components/editor/lexical/plugins/collapsible-plugin"
import { ComponentPickerMenuPlugin } from "@/components/editor/lexical/plugins/component-picker-menu-plugin"
import { ContextMenuPlugin } from "@/components/editor/lexical/plugins/context-menu-plugin"
import { DragDropPastePlugin } from "@/components/editor/lexical/plugins/drag-drop-paste-plugin"
import { DraggableBlockPlugin } from "@/components/editor/lexical/plugins/draggable-block-plugin"
import { AutoEmbedPlugin } from "@/components/editor/lexical/plugins/embeds/auto-embed-plugin"
import { FigmaPlugin } from "@/components/editor/lexical/plugins/embeds/figma-plugin"
import { TwitterPlugin } from "@/components/editor/lexical/plugins/embeds/twitter-plugin"
import { YouTubePlugin } from "@/components/editor/lexical/plugins/embeds/youtube-plugin"
import { EmojiPickerPlugin } from "@/components/editor/lexical/plugins/emoji-picker-plugin"
import { EmojisPlugin } from "@/components/editor/lexical/plugins/emojis-plugin"
import { EquationsPlugin } from "@/components/editor/lexical/plugins/equations-plugin"
import { FloatingLinkEditorPlugin } from "@/components/editor/lexical/plugins/floating-link-editor-plugin"
import { FloatingTextFormatToolbarPlugin } from "@/components/editor/lexical/plugins/floating-text-format-plugin"
import { ImagesPlugin } from "@/components/editor/lexical/plugins/images-plugin"
import { KeywordsPlugin } from "@/components/editor/lexical/plugins/keywords-plugin"
import { LayoutPlugin } from "@/components/editor/lexical/plugins/layout-plugin"
import { LinkPlugin } from "@/components/editor/lexical/plugins/link-plugin"
import { ListMaxIndentLevelPlugin } from "@/components/editor/lexical/plugins/list-max-indent-level-plugin"
import { MentionsPlugin } from "@/components/editor/lexical/plugins/mentions-plugin"
import { PageBreakPlugin } from "@/components/editor/lexical/plugins/page-break-plugin"
import { AlignmentPickerPlugin } from "@/components/editor/lexical/plugins/picker/alignment-picker-plugin"
import { BulletedListPickerPlugin } from "@/components/editor/lexical/plugins/picker/bulleted-list-picker-plugin"
import { CheckListPickerPlugin } from "@/components/editor/lexical/plugins/picker/check-list-picker-plugin"
import { CodePickerPlugin } from "@/components/editor/lexical/plugins/picker/code-picker-plugin"
import { CollapsiblePickerPlugin } from "@/components/editor/lexical/plugins/picker/collapsible-picker-plugin"
import { ColumnsLayoutPickerPlugin } from "@/components/editor/lexical/plugins/picker/columns-layout-picker-plugin"
import { DividerPickerPlugin } from "@/components/editor/lexical/plugins/picker/divider-picker-plugin"
import { EmbedsPickerPlugin } from "@/components/editor/lexical/plugins/picker/embeds-picker-plugin"
import { EquationPickerPlugin } from "@/components/editor/lexical/plugins/picker/equation-picker-plugin"
import { HeadingPickerPlugin } from "@/components/editor/lexical/plugins/picker/heading-picker-plugin"
import { ImagePickerPlugin } from "@/components/editor/lexical/plugins/picker/image-picker-plugin"
import { NumberedListPickerPlugin } from "@/components/editor/lexical/plugins/picker/numbered-list-picker-plugin"
import { PageBreakPickerPlugin } from "@/components/editor/lexical/plugins/picker/page-break-picker-plugin"
import { ParagraphPickerPlugin } from "@/components/editor/lexical/plugins/picker/paragraph-picker-plugin"
import { PollPickerPlugin } from "@/components/editor/lexical/plugins/picker/poll-picker-plugin"
import { QuotePickerPlugin } from "@/components/editor/lexical/plugins/picker/quote-picker-plugin"
import {
  DynamicTablePickerPlugin,
  TablePickerPlugin,
} from "@/components/editor/lexical/plugins/picker/table-picker-plugin"
import { PollPlugin } from "@/components/editor/lexical/plugins/poll-plugin"
import { TabFocusPlugin } from "@/components/editor/lexical/plugins/tab-focus-plugin"
import { TableActionMenuPlugin } from "@/components/editor/lexical/plugins/table-action-menu-plugin"
import { TableCellResizerPlugin } from "@/components/editor/lexical/plugins/table-cell-resizer-plugin"
import { TableHoverActionsPlugin } from "@/components/editor/lexical/plugins/table-hover-actions-plugin"
import { BlockFormatDropDown } from "@/components/editor/lexical/plugins/toolbar/block-format-toolbar-plugin"
import { FormatBulletedList } from "@/components/editor/lexical/plugins/toolbar/block-format/format-bulleted-list"
import { FormatCheckList } from "@/components/editor/lexical/plugins/toolbar/block-format/format-check-list"
import { FormatCodeBlock } from "@/components/editor/lexical/plugins/toolbar/block-format/format-code-block"
import { FormatHeading } from "@/components/editor/lexical/plugins/toolbar/block-format/format-heading"
import { FormatNumberedList } from "@/components/editor/lexical/plugins/toolbar/block-format/format-numbered-list"
import { FormatParagraph } from "@/components/editor/lexical/plugins/toolbar/block-format/format-paragraph"
import { FormatQuote } from "@/components/editor/lexical/plugins/toolbar/block-format/format-quote"
import { ClearFormattingToolbarPlugin } from "@/components/editor/lexical/plugins/toolbar/clear-formatting-toolbar-plugin"
import { CodeLanguageToolbarPlugin } from "@/components/editor/lexical/plugins/toolbar/code-language-toolbar-plugin"
import { ElementFormatToolbarPlugin } from "@/components/editor/lexical/plugins/toolbar/element-format-toolbar-plugin"
import { FontBackgroundToolbarPlugin } from "@/components/editor/lexical/plugins/toolbar/font-background-toolbar-plugin"
import { FontColorToolbarPlugin } from "@/components/editor/lexical/plugins/toolbar/font-color-toolbar-plugin"
import { FontFamilyToolbarPlugin } from "@/components/editor/lexical/plugins/toolbar/font-family-toolbar-plugin"
import { FontFormatToolbarPlugin } from "@/components/editor/lexical/plugins/toolbar/font-format-toolbar-plugin"
import { FontSizeToolbarPlugin } from "@/components/editor/lexical/plugins/toolbar/font-size-toolbar-plugin"
import { HistoryToolbarPlugin } from "@/components/editor/lexical/plugins/toolbar/history-toolbar-plugin"
import { LinkToolbarPlugin } from "@/components/editor/lexical/plugins/toolbar/link-toolbar-plugin"
import { SubSuperToolbarPlugin } from "@/components/editor/lexical/plugins/toolbar/subsuper-toolbar-plugin"
import { ToolbarPlugin } from "@/components/editor/lexical/plugins/toolbar/toolbar-plugin"
import { EMOJI } from "@/components/editor/lexical/transformers/markdown-emoji-transformer"
import { EQUATION } from "@/components/editor/lexical/transformers/markdown-equation-transformer"
import { HR } from "@/components/editor/lexical/transformers/markdown-hr-transformer"
import { IMAGE } from "@/components/editor/lexical/transformers/markdown-image-transformer"
import { TABLE } from "@/components/editor/lexical/transformers/markdown-table-transformer"
import { TWEET } from "@/components/editor/lexical/transformers/markdown-tweet-transformer"
import { Separator } from "@/components/ui/separator"

const placeholder = "Press / for commands..."

function EditorToolbarPortal() {
  const container =
    typeof window !== "undefined"
      ? document.getElementById("kayf-editor-header")
      : null

  if (!container) return null

  return (
    <ToolbarPlugin>
      {({ blockType }) =>
        createPortal(
          <div className="vertical-align-middle z-10 flex">
            <HistoryToolbarPlugin />
            <Separator orientation="vertical" className="h-8" />
            <BlockFormatDropDown>
              <FormatParagraph />
              <FormatHeading levels={["h1", "h2", "h3", "h4"]} />
              <FormatNumberedList />
              <FormatBulletedList />
              <FormatCheckList />
              <FormatCodeBlock />
              <FormatQuote />
            </BlockFormatDropDown>
            {blockType === "code" ? (
              <CodeLanguageToolbarPlugin />
            ) : (
              <>
                <FontFamilyToolbarPlugin />
                <FontSizeToolbarPlugin />
                <Separator orientation="vertical" className="h-8" />
                <FontFormatToolbarPlugin format="bold" />
                <FontFormatToolbarPlugin format="italic" />
                <FontFormatToolbarPlugin format="underline" />
                <FontFormatToolbarPlugin format="strikethrough" />
                <Separator orientation="vertical" className="h-8" />
                <SubSuperToolbarPlugin />
                <LinkToolbarPlugin />
                <Separator orientation="vertical" className="h-8" />
                <ClearFormattingToolbarPlugin />
                <Separator orientation="vertical" className="h-8" />
                <FontColorToolbarPlugin />
                <FontBackgroundToolbarPlugin />
                <Separator orientation="vertical" className="h-8" />
                <ElementFormatToolbarPlugin />
              </>
            )}
          </div>,
          container
        )
      }
    </ToolbarPlugin>
  )
}

function EditorFooterPortal() {
  const container =
    typeof window !== "undefined"
      ? document.getElementById("kayf-editor-footer")
      : null

  if (!container) return null

  return createPortal(
    <ActionsPlugin>
      <div className="clear-both flex items-center justify-between gap-2">
        <div>
          <CounterCharacterPlugin charset="UTF-16" />
        </div>
        <div className="flex flex-1 justify-end">
          <ShareContentPlugin />
          <ImportExportPlugin />
          <MarkdownTogglePlugin
            shouldPreserveNewLinesInMarkdown={true}
            transformers={[
              TABLE,
              HR,
              IMAGE,
              EMOJI,
              EQUATION,
              TWEET,
              CHECK_LIST,
              ...ELEMENT_TRANSFORMERS,
              ...MULTILINE_ELEMENT_TRANSFORMERS,
              ...TEXT_FORMAT_TRANSFORMERS,
              ...TEXT_MATCH_TRANSFORMERS,
            ]}
          />
          <EditModeTogglePlugin />
          <>
            <ClearEditorActionPlugin />
            <ClearEditorPlugin />
          </>
          <TreeViewPlugin />
        </div>
      </div>
    </ActionsPlugin>,
    container
  )
}

export function Plugins() {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null)

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  return (
    <div className="relative">
      <EditorToolbarPortal />

      <div className="relative">
        <AutoFocusPlugin />
        <RichTextPlugin
          contentEditable={
            <div>
              <div ref={onRef}>
                <ContentEditable
                  placeholder={placeholder}
                  className="relative block px-8 py-4 focus:outline-none"
                />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        {/* Plugins */}
        <ClickableLinkPlugin />
        <CheckListPlugin />
        <HorizontalRulePlugin />
        <TablePlugin />
        <ListPlugin />
        <TabIndentationPlugin />
        <HashtagPlugin />
        <HistoryPlugin />
        <MentionsPlugin />
        <PageBreakPlugin />
        <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
        <KeywordsPlugin />
        <EmojisPlugin />
        <ImagesPlugin />
        <TableCellResizerPlugin />
        <TableHoverActionsPlugin anchorElem={floatingAnchorElem} />
        <TableActionMenuPlugin anchorElem={floatingAnchorElem} cellMerge />
        <PollPlugin />
        <LayoutPlugin />
        <EquationsPlugin />
        <CollapsiblePlugin />
        <AutoEmbedPlugin />
        <FigmaPlugin />
        <TwitterPlugin />
        <YouTubePlugin />
        <CodeHighlightPlugin />
        <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
        <MarkdownShortcutPlugin
          transformers={[
            TABLE,
            HR,
            IMAGE,
            EMOJI,
            EQUATION,
            TWEET,
            CHECK_LIST,
            ...ELEMENT_TRANSFORMERS,
            ...MULTILINE_ELEMENT_TRANSFORMERS,
            ...TEXT_FORMAT_TRANSFORMERS,
            ...TEXT_MATCH_TRANSFORMERS,
          ]}
        />
        <TabFocusPlugin />
        <AutocompletePlugin />
        <AutoLinkPlugin />
        <LinkPlugin />
        <ComponentPickerMenuPlugin
          baseOptions={[
            ParagraphPickerPlugin(),
            HeadingPickerPlugin({ n: 1 }),
            HeadingPickerPlugin({ n: 2 }),
            HeadingPickerPlugin({ n: 3 }),
            HeadingPickerPlugin({ n: 4 }),
            TablePickerPlugin(),
            CheckListPickerPlugin(),
            NumberedListPickerPlugin(),
            BulletedListPickerPlugin(),
            QuotePickerPlugin(),
            CodePickerPlugin(),
            DividerPickerPlugin(),
            PageBreakPickerPlugin(),
            PollPickerPlugin(),
            EmbedsPickerPlugin({ embed: "figma" }),
            EmbedsPickerPlugin({ embed: "tweet" }),
            EmbedsPickerPlugin({ embed: "youtube-video" }),
            EquationPickerPlugin(),
            ImagePickerPlugin(),
            CollapsiblePickerPlugin(),
            ColumnsLayoutPickerPlugin(),
            AlignmentPickerPlugin({ alignment: "left" }),
            AlignmentPickerPlugin({ alignment: "center" }),
            AlignmentPickerPlugin({ alignment: "right" }),
            AlignmentPickerPlugin({ alignment: "justify" }),
          ]}
          dynamicOptionsFn={DynamicTablePickerPlugin}
        />
        <ContextMenuPlugin />
        <DragDropPastePlugin />
        <EmojiPickerPlugin />
        <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
        <FloatingTextFormatToolbarPlugin anchorElem={floatingAnchorElem} />
        <ListMaxIndentLevelPlugin />
      </div>

      <EditorFooterPortal />
    </div>
  )
}

