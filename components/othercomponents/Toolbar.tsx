"use client";

import React, { useCallback, useEffect, useState } from "react";
import { type Editor } from "@tiptap/react";
import toast from "react-hot-toast";
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Underline,
  Quote,
  Undo,
  Redo,
  Code,
  Link,
  Braces,
  Grid3x3,
  BetweenHorizontalStart,
  TableRowsSplit,
  TableColumnsSplit,
  BetweenVerticalStart,
  Grid2x2X,
  Image as ImageIcon,
} from "lucide-react";
import { TbTableExport } from "react-icons/tb";

import LinkDialog from "./urlDialog";

type Props = {
  editor: Editor | null;
  content: string;

};

const Toolbar = ({ editor, content}: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previousUrl, setPreviousUrl] = useState("");
  const [isTableActive, setIsTableActive] = useState(false);

  const openLinkDialog = useCallback(() => {
    const url = editor?.getAttributes("link").href || "";
    setPreviousUrl(url);
    setIsDialogOpen(true);
  }, [editor]);

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          editor?.chain().focus().setImage({ src: base64String }).run();
        };
        reader.readAsDataURL(file);
      }
    },
    [editor]
  );

  useEffect(() => {
    if (!editor) return;

    const updateTableActiveState = () => {
      setIsTableActive(editor.isActive("table"));
    };

    editor.on("selectionUpdate", updateTableActiveState);

    return () => {
      editor.off("selectionUpdate", updateTableActiveState);
    };
  }, [editor]);

  const setLink = useCallback(
    (url: string) => {
      if (url === null) {
        return;
      }
      if (url === "") {
        editor?.chain().focus().extendMarkRange("link").unsetLink().run();

        return;
      }
      try {
        editor
          ?.chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: url })
          .run();
      } catch (e) {
        toast.error((e as Error).message);
      }
    },
    [editor]
  );

  if (!editor) {
    return null;
  }
  return (
    <div
      className="px-4 py-3 rounded-tl-md rounded-tr-md flex justify-between items-start
    gap-5 w-full flex-wrap border border-gray-700"
    >
      <div className="flex justify-start items-center gap-4 w-full lg:w-10/12 flex-wrap ">
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className={
            editor.isActive("bold")
              ? "bg-sky-700 text-white p-2 rounded-lg"
              : "text-sky-400"
          }
        >
          <Bold className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          className={
            editor.isActive("italic")
              ? "bg-sky-700 text-white p-2 rounded-lg"
              : "text-sky-400"
          }
        >
          <Italic className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleUnderline().run();
          }}
          className={
            editor.isActive("underline")
              ? "bg-sky-700 text-white p-2 rounded-lg"
              : "text-sky-400"
          }
        >
          <Underline className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleStrike().run();
          }}
          className={
            editor.isActive("strike")
              ? "bg-sky-700 text-white p-2 rounded-lg"
              : "text-sky-400"
          }
        >
          <Strikethrough className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          className={
            editor.isActive("heading", { level: 2 })
              ? "bg-sky-700 text-white p-2 rounded-lg"
              : "text-sky-400"
          }
        >
          <Heading2 className="w-5 h-5" />
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
          className={
            editor.isActive("bulletList")
              ? "bg-sky-700 text-white p-2 rounded-lg"
              : "text-sky-400"
          }
        >
          <List className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
          className={
            editor.isActive("orderedList")
              ? "bg-sky-700 text-white p-2 rounded-lg"
              : "text-sky-400"
          }
        >
          <ListOrdered className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBlockquote().run();
          }}
          className={
            editor.isActive("blockquote")
              ? "bg-sky-700 text-white p-2 rounded-lg"
              : "text-sky-400"
          }
        >
          <Quote className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setCode().run();
          }}
          className={
            editor.isActive("code")
              ? "bg-sky-700 text-white p-2 rounded-lg"
              : "text-sky-400"
          }
        >
          <Code className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().undo().run();
          }}
          className={
            editor.isActive("undo")
              ? "bg-sky-700 text-white p-2 rounded-lg"
              : "text-sky-400 hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg"
          }
        >
          <Undo className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().redo().run();
          }}
          className={
            editor.isActive("redo")
              ? "bg-sky-700 text-white p-2 rounded-lg"
              : "text-sky-400 hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg"
          }
        >
          <Redo className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            openLinkDialog();
          }}
          className="text-sky-400"
        >
          <Link className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleCodeBlock().run();
          }}
          className={
            editor.isActive("codeBlock")
              ? "bg-sky-700 text-white p-2 rounded-lg"
              : "text-sky-400 hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg"
          }
        >
          <Braces className="w-5 h-5" />
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="text-sky-400 cursor-pointer">
          <ImageIcon className="w-5 h-5" />
        </label>
        <button
          className="text-white"
          onClick={(e) => {
            e.preventDefault();
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run();
          }}
        >
          <Grid3x3 className="text-sky-400" />
        </button>
        {isTableActive && (
          <>
            <button
              className="text-white"
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().addColumnBefore().run();
              }}
            >
              <BetweenHorizontalStart className="text-sky-100" />
            </button>

            <button
              className="text-white"
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().deleteColumn().run();
              }}
            >
              <TableColumnsSplit className="text-sky-100" />
            </button>
            <button
              className="text-white"
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().addRowBefore().run();
              }}
            >
              <BetweenVerticalStart className="text-sky-100" />
            </button>
            <button
              className="text-white"
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().deleteRow().run();
              }}
            >
              <TableRowsSplit className="text-sky-100" />
            </button>
            <button
              className="text-white"
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().deleteTable().run();
              }}
            >
              <Grid2x2X className="text-sky-100" />
            </button>

            <button
              className="text-white"
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().setCellAttribute("colspan", 2).run();
              }}
            >
              <TbTableExport className="text-sky-100 w-6 h-6" />
            </button>
          </>
        )}
        <LinkDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={setLink}
          previousUrl={previousUrl}
        />
      </div>
      {content && (
        <button
          type="submit"
          className="px-4 bg-sky-700 text-white py-2 rounded-md"
        >
          Publish
        </button>
      )}
    </div>
  );
};

export default Toolbar;
