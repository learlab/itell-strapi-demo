import { getNotesAction } from "@/actions/note";

import { NoteList } from "./note-list";

type Props = {
  pageSlug: string;
};

export const NoteLoader = async ({ pageSlug }: Props) => {
  const [data, err] = await getNotesAction({ pageSlug });
  if (!err) {
    return <NoteList notes={data} pageSlug={pageSlug} />;
  }

  return null;
};
