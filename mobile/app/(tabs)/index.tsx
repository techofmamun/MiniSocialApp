import React, { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { Searchbar, Text, useTheme } from "react-native-paper";
import { LoadingSpinner } from "../../src/components/common/LoadingSpinner";
import { PostCard } from "../../src/components/post/PostCard";
import { usePosts } from "../../src/hooks/usePosts";
import { Post } from "../../src/types";

export default function FeedScreen() {
  const theme = useTheme();
  const [usernameFilter, setUsernameFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setUsernameFilter(searchQuery.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = usePosts(usernameFilter);

  const posts = data?.pages.flatMap((page) => page.data) || [];

  const handleSearch = () => {
    setUsernameFilter(searchQuery.trim());
  };

  const handleClearFilter = () => {
    setSearchQuery("");
    setUsernameFilter("");
  };

  const renderItem = useCallback(
    ({ item }: { item: Post }) => <PostCard post={item} />,
    [],
  );

  const renderEmpty = () => {
    if (isLoading && posts.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <LoadingSpinner size="large" />
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Text
          variant="titleMedium"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          {usernameFilter ? "No posts found" : "No posts yet"}
        </Text>
        <Text
          variant="bodyMedium"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          {usernameFilter
            ? "Try a different username"
            : "Be the first to post!"}
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footer}>
        <LoadingSpinner size="small" />
      </View>
    );
  };

  const renderItemSeparator = () => (
    <View
      style={[styles.itemSeperator, { backgroundColor: theme.colors.backdrop }]}
    />
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.contentContainer}>
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Filter by username"
            onChangeText={setSearchQuery}
            value={searchQuery}
            onSubmitEditing={handleSearch}
            onIconPress={handleSearch}
            style={styles.searchBar}
          />
          {usernameFilter && (
            <Text
              variant="labelMedium"
              style={[styles.filterText, { color: theme.colors.primary }]}
              onPress={handleClearFilter}
            >
              Clear filter: @{usernameFilter}
            </Text>
          )}
        </View>
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
              refreshing={isRefetching}
              onRefresh={refetch}
            />
          }
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          contentContainerStyle={
            posts.length === 0 ? styles.emptyListContainer : undefined
          }
          ItemSeparatorComponent={renderItemSeparator}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingTop: 100,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  itemSeperator: {
    height: StyleSheet.hairlineWidth,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchBar: {
    elevation: 0,
  },
  filterText: {
    marginTop: 8,
    textAlign: "center",
  },
});
