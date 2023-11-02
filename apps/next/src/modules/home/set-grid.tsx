import { useSession } from "next-auth/react";

import { api } from "@quenti/trpc";

import { Grid, GridItem, Heading, Skeleton, Stack } from "@chakra-ui/react";

import { FolderCard } from "../../components/folder-card";
import { StudySetCard } from "../../components/study-set-card";

export const SetGrid = () => {
  const { status } = useSession();
  const { data, isLoading: recentLoading } = api.recent.get.useQuery();
  const isLoading = status == "unauthenticated" || recentLoading;

  if (data && !data.entities.length) return null;

  return (
    <Stack spacing={6}>
      <Skeleton isLoaded={!!data} rounded="md" fitContent>
        <Heading size="lg">Recent</Heading>
      </Skeleton>
      <Grid templateColumns="repeat(auto-fill, minmax(256px, 1fr))" gap={4}>
        {isLoading &&
          Array.from({ length: 16 }).map((_, i) => (
            <GridItem h="156px" key={i}>
              <Skeleton
                rounded="lg"
                height="full"
                border="2px"
                borderColor="gray.700"
              />
            </GridItem>
          ))}
        {(data?.entities || []).map((item) => (
          <GridItem key={item.id} h="156px">
            {item.type == "set" ? (
              <StudySetCard
                studySet={{ ...item, visibility: item.visibility! }}
                numTerms={item.numItems}
                user={item.user}
              />
            ) : (
              <FolderCard
                folder={{ ...item }}
                numSets={item.numItems}
                user={item.user}
              />
            )}
          </GridItem>
        ))}
      </Grid>
    </Stack>
  );
};