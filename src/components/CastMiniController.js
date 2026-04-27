import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

let useCastState = () => null;
let useRemoteMediaClient = () => null;
let useMediaStatus = () => null;
let MediaPlayerState = {};

try {
  const googleCast = require("react-native-google-cast");
  useCastState = googleCast.useCastState;
  useRemoteMediaClient = googleCast.useRemoteMediaClient;
  useMediaStatus = googleCast.useMediaStatus;
  MediaPlayerState = googleCast.MediaPlayerState;
} catch {}

const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 85 : 65;

const CastMiniController = () => {
  // Don't render on web
  if (Platform.OS === "web") return null;

  const castState = useCastState();
  const client = useRemoteMediaClient();
  const mediaStatus = useMediaStatus();

  // No renderizar si: sin sesión, sin cliente, o sin media cargada aún
  if (castState !== "connected" || !client || !mediaStatus) return null;

  const isPlaying = mediaStatus.playerState === MediaPlayerState.PLAYING ||
                    mediaStatus.playerState === MediaPlayerState.BUFFERING;

  const title = mediaStatus.mediaInfo?.metadata?.title ?? "Reproduciendo en TV";
  const subtitle = mediaStatus.mediaInfo?.metadata?.subtitle ?? null;

  const handlePlayPause = () => {
    if (isPlaying) {
      client.pause().catch(() => {});
    } else {
      client.play().catch(() => {});
    }
  };

  return (
    <View style={styles.container}>
      <MaterialIcons name="cast-connected" size={18} color="#007bff" />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        )}
      </View>
      <TouchableOpacity
        onPress={handlePlayPause}
        hitSlop={{ top: 10, bottom: 10, left: 12, right: 12 }}
      >
        <MaterialIcons
          name={isPlaying ? "pause" : "play-arrow"}
          size={30}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: TAB_BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderTopWidth: 1,
    borderTopColor: "#444",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
    zIndex: 10,
    elevation: 8,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  subtitle: {
    color: "#aaa",
    fontSize: 11,
    marginTop: 2,
  },
});

export default CastMiniController;
