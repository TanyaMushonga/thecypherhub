import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

type LinkDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
  previousUrl: string;
};

const LinkDialog = ({
  isOpen,
  onClose,
  onSubmit,
  previousUrl,
}: LinkDialogProps) => {
  const [url, setUrl] = useState(previousUrl);

  const handleSubmit = () => {
    onSubmit(url);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <p className="text-white">Insert Link</p>
          </DialogTitle>
          <DialogDescription>
            <p className="text-slate-200">Please enter the URL for the selected text.</p>
          </DialogDescription>
        </DialogHeader>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-500 text-white p-2 rounded"
        >
          Submit
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default LinkDialog;
