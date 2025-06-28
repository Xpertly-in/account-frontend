import React, { useState } from "react";
import { Button } from "@/ui/Button.ui";
import { Textarea } from "@/ui/Textarea.ui";
import { NotePencil, CheckCircle } from "@phosphor-icons/react";
import { ContactRequest } from "@/types/dashboard/contact-request.type";
import { Toast } from "@/ui/Toast.ui";

interface ContactRequestNotesProps {
  contactRequest: ContactRequest;
  onNotesUpdate?: (id: string, notes: string) => void;
}

export const ContactRequestNotes: React.FC<ContactRequestNotesProps> = ({
  contactRequest,
  onNotesUpdate,
}) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(contactRequest.ca_private_notes || "");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Handle notes save
  const handleNotesSave = async () => {
    if (!onNotesUpdate) return;

    const originalNotes = contactRequest.ca_private_notes || "";
    const trimmedNotes = notes.trim();

    // Don't save if notes haven't changed
    if (trimmedNotes === originalNotes) {
      setIsEditingNotes(false);
      return;
    }

    setIsSavingNotes(true);

    try {
      await onNotesUpdate(contactRequest.id, trimmedNotes);
      setIsEditingNotes(false);

      // Show appropriate success message
      if (originalNotes === "" && trimmedNotes !== "") {
        Toast.success({
          title: "Private note added",
          description: "Your confidential note has been saved successfully.",
        });
      } else if (originalNotes !== "" && trimmedNotes !== "") {
        Toast.success({
          title: "Private note updated",
          description: "Your changes have been saved successfully.",
        });
      } else if (trimmedNotes === "") {
        Toast.success({
          title: "Private note removed",
          description: "The note has been deleted successfully.",
        });
      }
    } catch (error) {
      console.error("Failed to update notes:", error);
      Toast.error({
        title: "Failed to save note",
        description: "Please try again or contact support if the problem persists.",
      });
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Handle notes cancel
  const handleNotesCancel = () => {
    const hasUnsavedChanges = notes.trim() !== (contactRequest.ca_private_notes || "").trim();

    setNotes(contactRequest.ca_private_notes || "");
    setIsEditingNotes(false);

    // Show toast if user had unsaved changes
    if (hasUnsavedChanges) {
      Toast.info({
        title: "Changes discarded",
        description: "Your note changes were not saved.",
      });
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6">
      {/* Enhanced Section Header - Mobile Optimized */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-200/30 dark:border-amber-700/30">
            <NotePencil
              className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600 dark:text-amber-400"
              weight="bold"
              data-testid="note-pencil-icon"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
              Private Notes
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              Only visible to you
            </span>
          </div>
        </div>
        {!isEditingNotes && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditingNotes(true)}
            className="h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm font-medium hover:bg-amber-50 hover:border-amber-300 dark:hover:bg-amber-900/20 dark:hover:border-amber-600 transition-colors rounded-lg"
          >
            <NotePencil
              className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2"
              data-testid="note-pencil-icon"
            />
            {notes ? "Edit" : "Add"}
          </Button>
        )}
      </div>

      {isEditingNotes ? (
        <div className="space-y-3 sm:space-y-4">
          <div className="relative">
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add private notes... (Only you can see this)"
              className="min-h-[80px] sm:min-h-[100px] text-sm border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:border-amber-300 dark:focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
              disabled={isSavingNotes}
            />
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 rounded-full px-2 sm:px-3 py-1 sm:py-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
              <span className="text-xs text-amber-700 dark:text-amber-300 font-semibold">
                Private
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-amber-600 dark:text-amber-400">
              <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Customer cannot see these notes</span>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Button
                size="sm"
                onClick={handleNotesSave}
                disabled={isSavingNotes}
                className="h-8 sm:h-9 px-3 sm:px-5 text-xs sm:text-sm font-medium bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 rounded-lg"
              >
                <CheckCircle
                  className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2"
                  data-testid="check-circle-icon"
                />
                {isSavingNotes ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNotesCancel}
                disabled={isSavingNotes}
                className="h-8 sm:h-9 px-3 sm:px-5 text-xs sm:text-sm font-medium rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-amber-200/40 dark:border-amber-700/40 relative">
          {notes ? (
            <>
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex items-center gap-1 bg-amber-200/50 dark:bg-amber-800/50 rounded-full px-2 sm:px-3 py-1 sm:py-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-600"></div>
                <span className="text-xs text-amber-700 dark:text-amber-300 font-semibold">
                  Private
                </span>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300 pr-16 sm:pr-20 leading-relaxed">
                {notes}
              </p>
            </>
          ) : (
            <div className="flex items-center justify-center py-4 sm:py-6 text-center">
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1.5 sm:gap-2 text-amber-600 dark:text-amber-400">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-semibold">No private notes yet</span>
                </div>
                <p className="text-xs text-amber-600/80 dark:text-amber-400/80 font-medium">
                  Add confidential notes that only you can see
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
