import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { Session } from '@prisma/client';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import EditSessionForm from '@/components/EditSessionForm';

export default async function EditCoursePage({ params }: { params: { id: string | string[] } }) {
  // Protect the page, only logged in users can access it.
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
      // eslint-disable-next-line @typescript-eslint/comma-dangle
    } | null,
  );
  // Extracts id number from URL for lookup and editing of course
  const id = Number(Array.isArray(params?.id) ? params?.id[0] : params?.id);

  // TODO: Modify where clause below to lookup props of selected course
  const userSession: Session | null = await prisma.session.findUnique({
    where: { id },
  });
  // console.log(stuff);
  if (!userSession) {
    return notFound();
  }

  return (
    <main>
      <EditSessionForm session={userSession} oldID={id} />
    </main>
  );
}
