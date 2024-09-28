import { getNotesAction } from "@/actions/note";

import { NoteList } from "./note-list";

type Props = {
  pageSlug: string;
};

export async function NoteLoader({ pageSlug }: Props) {
  const [data, err] = await getNotesAction({ pageSlug });
  if (!err) {
    return <NoteList notes={data} pageSlug={pageSlug} />;
  }

  return null;
}
