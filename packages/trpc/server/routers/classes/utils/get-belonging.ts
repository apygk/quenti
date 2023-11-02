import type { Widen } from "@quenti/lib/widen";
import { prisma } from "@quenti/prisma";
import { Prisma } from "@quenti/prisma/client";

const classSelect = Prisma.validator<Prisma.ClassDefaultArgs["select"]>()({
  id: true,
  name: true,
  logoUrl: true,
  logoHash: true,
  bannerUrl: true,
  bannerHash: true,
});

const teacherCountSelect =
  Prisma.validator<Prisma.ClassCountOutputTypeDefaultArgs>()({
    select: {
      sections: true,
      members: {
        where: {
          type: "Student",
        },
      },
    },
  });

const studentCountSelect =
  Prisma.validator<Prisma.ClassCountOutputTypeDefaultArgs>()({
    select: {
      folders: true,
      studySets: true,
    },
  });

export const getBelongingClasses = async (userId: string) => {
  const teacherClasses = await prisma.classMembership.findMany({
    where: {
      userId,
      type: "Teacher",
    },
    include: {
      class: {
        select: {
          ...classSelect,
          _count: teacherCountSelect,
        },
      },
    },
  });
  const studentClasses = await prisma.classMembership.findMany({
    where: {
      userId,
      type: "Student",
    },
    include: {
      class: {
        select: {
          ...classSelect,
          _count: studentCountSelect,
        },
      },
    },
  });

  type Unified = Widen<
    (typeof teacherClasses)[number] | (typeof studentClasses)[number]
  >;
  const classes = (teacherClasses as Unified[]).concat(
    studentClasses as Unified[],
  );

  return classes.map((membership) => ({
    viewedAt: membership.viewedAt,
    as: membership.type,
    ...membership.class,
  }));
};