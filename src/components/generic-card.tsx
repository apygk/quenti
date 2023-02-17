import {
  Avatar,
  Box,
  Flex,
  Heading,
  HStack,
  LinkBox,
  LinkOverlay,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  IconDiscountCheck,
  IconDotsVertical,
  IconTrash,
} from "@tabler/icons-react";
import React from "react";
import { avatarUrl } from "../utils/avatar";
import { plural } from "../utils/string";
import { MenuOption } from "./menu-option";

export interface GenericCardProps {
  title: string;
  numItems: number;
  itemsLabel: string;
  url: string;
  user: {
    username: string;
    image: string | null;
  };
  reverseTitle?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  verified?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

export const GenericCard: React.FC<GenericCardProps> = ({
  title,
  numItems,
  itemsLabel,
  url,
  user,
  reverseTitle = false,
  leftIcon,
  rightIcon,
  verified = false,
  removable = false,
  onRemove,
}) => {
  const termsTextColor = useColorModeValue("gray.600", "gray.400");
  const linkBg = useColorModeValue("white", "gray.800");
  const linkBorder = useColorModeValue("gray.200", "gray.700");
  const menuBg = useColorModeValue("white", "gray.800");

  return (
    <LinkBox
      as="article"
      h="full"
      rounded="md"
      p="5"
      bg={linkBg}
      borderColor={linkBorder}
      borderWidth="2px"
      shadow="lg"
      transition="all ease-in-out 150ms"
      zIndex="10"
      _hover={{
        transform: "translateY(-2px)",
        borderBottomColor: "blue.300",
      }}
    >
      <Flex justifyContent="space-between" flexDir="column" h="full" gap={4}>
        <Stack
          spacing={2}
          direction={reverseTitle ? "column-reverse" : "column"}
        >
          <Heading
            size="md"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              lineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            <LinkOverlay href={url}>{title}</LinkOverlay>
          </Heading>
          <HStack gap={0} color={termsTextColor}>
            {leftIcon}
            <Text fontSize="sm">{plural(numItems, itemsLabel)}</Text>
            {rightIcon}
          </HStack>
        </Stack>
        <Flex justifyContent="space-between">
          <HStack spacing={2}>
            <Avatar src={avatarUrl(user)} size="xs" />
            <HStack spacing={1}>
              <Text fontSize="sm" fontWeight={600}>
                {user.username}
              </Text>
              {verified && (
                <Box>
                  <IconDiscountCheck aria-label="Verified" size={18} />
                </Box>
              )}
            </HStack>
          </HStack>
          {removable && (
            <Box zIndex="20">
              <Menu placement="bottom-end">
                <MenuButton>
                  <Box w="24px">
                    <IconDotsVertical size="20" />
                  </Box>
                </MenuButton>
                <MenuList bg={menuBg} py={0} overflow="hidden">
                  <MenuOption
                    icon={<IconTrash size={20} />}
                    label="Remove"
                    onClick={onRemove}
                  />
                </MenuList>
              </Menu>
            </Box>
          )}
        </Flex>
      </Flex>
    </LinkBox>
  );
};
