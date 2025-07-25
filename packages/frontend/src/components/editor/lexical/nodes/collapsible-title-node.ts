import {
  $createParagraphNode,
  $isElementNode,
  DOMConversionMap,
  DOMConversionOutput,
  EditorConfig,
  ElementNode,
  LexicalEditor,
  LexicalNode,
  RangeSelection,
  SerializedElementNode,
} from "lexical"

import { $isCollapsibleContainerNode } from "@/components/editor/lexical/nodes/collapsible-container-node"
import { $isCollapsibleContentNode } from "@/components/editor/lexical/nodes/collapsible-content-node"
import { IS_CHROME } from "@/components/editor/lexical/shared/environment"
import { invariant } from "@/components/editor/lexical/shared/invariant"

type SerializedCollapsibleTitleNode = SerializedElementNode

export function $convertSummaryElement(
  domNode: HTMLElement
): DOMConversionOutput | null {
  const node = $createCollapsibleTitleNode()
  return {
    node,
  }
}

export class CollapsibleTitleNode extends ElementNode {
  static getType(): string {
    return "collapsible-title"
  }

  static clone(node: CollapsibleTitleNode): CollapsibleTitleNode {
    return new CollapsibleTitleNode(node.__key)
  }

  createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement {
    const dom = document.createElement("summary")
    dom.classList.add("Collapsible__title")
    if (IS_CHROME) {
      dom.addEventListener("click", () => {
        editor.update(() => {
          const collapsibleContainer = this.getLatest().getParentOrThrow()
          invariant(
            $isCollapsibleContainerNode(collapsibleContainer),
            "Expected parent node to be a CollapsibleContainerNode"
          )
          collapsibleContainer.toggleOpen()
        })
      })
    }
    return dom
  }

  updateDOM(prevNode: CollapsibleTitleNode, dom: HTMLElement): boolean {
    return false
  }

  static importDOM(): DOMConversionMap | null {
    return {
      summary: (domNode: HTMLElement) => {
        return {
          conversion: $convertSummaryElement,
          priority: 1,
        }
      },
    }
  }

  static importJSON(
    serializedNode: SerializedCollapsibleTitleNode
  ): CollapsibleTitleNode {
    return $createCollapsibleTitleNode()
  }

  exportJSON(): SerializedCollapsibleTitleNode {
    return {
      ...super.exportJSON(),
      type: "collapsible-title",
      version: 1,
    }
  }

  collapseAtStart(_selection: RangeSelection): boolean {
    this.getParentOrThrow().insertBefore(this)
    return true
  }

  static transform(): (node: LexicalNode) => void {
    return (node: LexicalNode) => {
      invariant(
        $isCollapsibleTitleNode(node),
        "node is not a CollapsibleTitleNode"
      )
      if (node.isEmpty()) {
        node.remove()
      }
    }
  }

  insertNewAfter(_: RangeSelection, restoreSelection = true): ElementNode {
    const containerNode = this.getParentOrThrow()

    if (!$isCollapsibleContainerNode(containerNode)) {
      throw new Error(
        "CollapsibleTitleNode expects to be child of CollapsibleContainerNode"
      )
    }

    if (containerNode.getOpen()) {
      const contentNode = this.getNextSibling()
      if (!$isCollapsibleContentNode(contentNode)) {
        throw new Error(
          "CollapsibleTitleNode expects to have CollapsibleContentNode sibling"
        )
      }

      const firstChild = contentNode.getFirstChild()
      if ($isElementNode(firstChild)) {
        return firstChild
      } else {
        const paragraph = $createParagraphNode()
        contentNode.append(paragraph)
        return paragraph
      }
    } else {
      const paragraph = $createParagraphNode()
      containerNode.insertAfter(paragraph, restoreSelection)
      return paragraph
    }
  }
}

export function $createCollapsibleTitleNode(): CollapsibleTitleNode {
  return new CollapsibleTitleNode()
}

export function $isCollapsibleTitleNode(
  node: LexicalNode | null | undefined
): node is CollapsibleTitleNode {
  return node instanceof CollapsibleTitleNode
}
