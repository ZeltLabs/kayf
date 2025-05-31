import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { HashtagNode } from "@lexical/hashtag"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { ListItemNode, ListNode } from "@lexical/list"
import { OverflowNode } from "@lexical/overflow"
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table"
import {
  Klass,
  LexicalNode,
  LexicalNodeReplacement,
  ParagraphNode,
  TextNode,
} from "lexical"

import { AutocompleteNode } from "@/components/editor/lexical/nodes/autocomplete-node"
import { CollapsibleContainerNode } from "@/components/editor/lexical/nodes/collapsible-container-node"
import { CollapsibleContentNode } from "@/components/editor/lexical/nodes/collapsible-content-node"
import { CollapsibleTitleNode } from "@/components/editor/lexical/nodes/collapsible-title-node"
import { FigmaNode } from "@/components/editor/lexical/nodes/embeds/figma-node"
import { TweetNode } from "@/components/editor/lexical/nodes/embeds/tweet-node"
import { YouTubeNode } from "@/components/editor/lexical/nodes/embeds/youtube-node"
import { EmojiNode } from "@/components/editor/lexical/nodes/emoji-node"
import { EquationNode } from "@/components/editor/lexical/nodes/equation-node"
import { ImageNode } from "@/components/editor/lexical/nodes/image-node"
import { KeywordNode } from "@/components/editor/lexical/nodes/keyword-node"
import { LayoutContainerNode } from "@/components/editor/lexical/nodes/layout-container-node"
import { LayoutItemNode } from "@/components/editor/lexical/nodes/layout-item-node"
import { MentionNode } from "@/components/editor/lexical/nodes/mention-node"
import { PageBreakNode } from "@/components/editor/lexical/nodes/page-break-node"
import { PollNode } from "@/components/editor/lexical/nodes/poll-node"

export const nodes: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> =
  [
    HeadingNode,
    ParagraphNode,
    TextNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    LinkNode,
    OverflowNode,
    HashtagNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    CodeNode,
    CodeHighlightNode,
    HorizontalRuleNode,
    MentionNode,
    PageBreakNode,
    ImageNode,
    EmojiNode,
    KeywordNode,
    PollNode,
    LayoutContainerNode,
    LayoutItemNode,
    EquationNode,
    CollapsibleContainerNode,
    CollapsibleContentNode,
    CollapsibleTitleNode,
    AutoLinkNode,
    FigmaNode,
    TweetNode,
    YouTubeNode,
    AutocompleteNode,
  ]
