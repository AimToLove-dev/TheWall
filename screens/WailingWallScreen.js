"use client";

import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  Pressable,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import BottomSheet from "components/BottomSheet";
// Assuming these components exist in your project
import { AddSoulInput, HeaderText, BodyText, BackButton } from "components";
import { setSouls } from "utils/soulsUtils";

// Hardcoded test list of names (FirstName LastInitial)
const testNames = [
  "John D.",
  "Sarah M.",
  "Michael R.",
  "Emily S.",
  "David W.",
  "Jessica T.",
  "Daniel P.",
  "Olivia H.",
  "Matthew C.",
  "Sophia G.",
  "William B.",
  "Ava J.",
  "James K.",
  "Emma L.",
  "Joseph N.",
  "Mia O.",
  "Benjamin Q.",
  "Charlotte R.",
  "Jacob S.",
  "Amelia T.",
  "Ethan U.",
  "Abigail V.",
  "Alexander W.",
  "Elizabeth X.",
  "Nicholas Y.",
  "Grace Z.",
  "Andrew A.",
  "Lily B.",
  "Samuel C.",
  "Hannah D.",
  "Christopher E.",
  "Zoe F.",
  "Joshua G.",
  "Natalie H.",
  "Ryan I.",
  "Ella J.",
  "Tyler K.",
  "Victoria L.",
  "Dylan M.",
  "Audrey N.",
];

// Vertical Marquee Implementation
const MeasureElement = ({ onLayout, children }) => (
  <Animated.ScrollView
    style={marqueeStyles.hidden}
    pointerEvents="box-none"
    scrollEnabled={false}
  >
    <View onLayout={(ev) => onLayout(ev.nativeEvent.layout.height)}>
      {children}
    </View>
  </Animated.ScrollView>
);

const TranslatedElement = ({ index, children, offset, childrenHeight }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      top: (index - 1) * childrenHeight,
      transform: [
        {
          translateY: -offset.value,
        },
      ],
    };
  });
  return (
    <Animated.View style={[styles.animatedStyle, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

const getIndicesArray = (length) => Array.from({ length }, (_, i) => i);

const Cloner = ({ count, renderChild }) => (
  <>{getIndicesArray(count).map(renderChild)}</>
);

const ChildrenScroller = ({
  duration,
  childrenHeight,
  parentHeight,
  children,
  isPaused,
}) => {
  const offset = useSharedValue(0);

  // Use a frame callback for smooth animation
  useFrameCallback((i) => {
    // Only update animation if not paused
    if (!isPaused) {
      const timeSincePreviousFrame = i.timeSincePreviousFrame ?? 16;
      // Move the content upward (negative value)
      offset.value += (timeSincePreviousFrame * childrenHeight) / duration;
      offset.value = offset.value % childrenHeight;
    }
  }, true);

  const count = Math.round(parentHeight / childrenHeight) + 2;
  const renderChild = (index) => (
    <TranslatedElement
      key={`clone-${index}`}
      index={index}
      offset={offset}
      childrenHeight={childrenHeight}
    >
      {children}
    </TranslatedElement>
  );

  return <Cloner count={count} renderChild={renderChild} />;
};

const VerticalMarquee = ({ duration = 30000, children, style, isPaused }) => {
  const [parentHeight, setParentHeight] = React.useState(0);
  const [childrenHeight, setChildrenHeight] = React.useState(0);

  return (
    <View
      style={style}
      onLayout={(ev) => {
        setParentHeight(ev.nativeEvent.layout.height);
      }}
      pointerEvents="box-none"
    >
      <View style={marqueeStyles.column} pointerEvents="box-none">
        <MeasureElement onLayout={setChildrenHeight}>{children}</MeasureElement>

        {childrenHeight > 0 && parentHeight > 0 && (
          <ChildrenScroller
            duration={duration}
            parentHeight={parentHeight}
            childrenHeight={childrenHeight}
            isPaused={isPaused}
          >
            {children}
          </ChildrenScroller>
        )}
      </View>
    </View>
  );
};

const marqueeStyles = StyleSheet.create({
  hidden: { opacity: 0, zIndex: -1 },
  column: { flexDirection: "column", overflow: "hidden" },
});

// Names component to display in the marquee
const NamesListComponent = () => (
  <View style={styles.namesContainer}>
    {testNames.map((name, index) => (
      <View key={index} style={styles.nameItem}>
        <Text style={styles.nameText}>{name}</Text>
      </View>
    ))}
  </View>
);

export const WailingWallScreen = () => {
  const [isPaused, setIsPaused] = useState(false);
  // Use a regular boolean state instead of a shared value
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const navigation = useNavigation();

  const handleSoulAdded = (soulId, soulData) => {
    // Add the new soul to the list without refetching everything
    setSouls((prevSouls) => [...prevSouls, { id: soulId, ...soulData }]);
    // Close the bottom sheet after adding
    setBottomSheetVisible(false);
  };

  const handlePressIn = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handlePressOut = useCallback(() => {
    setIsPaused(false);
  }, []);

  // Toggle bottom sheet function
  const toggleBottomSheet = useCallback(() => {
    setBottomSheetVisible((prev) => !prev);
  }, []);

  return (
    <View
      className="wailing-wall-screen"
      style={[styles.container, { height: Dimensions.get("window").height }]}
    >
      <ImageBackground
        source={require("../assets/paper.jpg")}
        style={styles.backgroundImage}
        resizeMode="repeat"
      >
        <View style={styles.contentContainer}>
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.pressableContainer}
          >
            <VerticalMarquee
              style={styles.marqueeContainer}
              duration={50000}
              isPaused={isPaused}
            >
              <NamesListComponent />
            </VerticalMarquee>
          </Pressable>
        </View>
      </ImageBackground>
      {/* Back Button */}
      <BackButton customOnPress={() => navigation.navigate("Home")} />
      {/* Plus Button */}
      <TouchableOpacity
        style={styles.plusButton}
        onPress={toggleBottomSheet}
        activeOpacity={0.7}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
      {/* Bottom Sheet - rendered outside the ImageBackground for proper layering */}
      <BottomSheet
        style={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        isVisible={isBottomSheetVisible}
        onClose={toggleBottomSheet}
        duration={400}
      >
        <View style={styles.bottomSheetContent}>
          <HeaderText style={styles.bottomSheetTitle}>
            Add a New Prayer
          </HeaderText>
          <BodyText style={styles.bottomSheetDescription}>
            Enter the name of someone you'd like to pray for
          </BodyText>

          <AddSoulInput onSuccess={handleSoulAdded} />
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  header: {
    padding: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#333",
    fontStyle: "italic",
    marginBottom: 8,
  },
  marqueeContainer: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
  },
  namesContainer: {
    paddingVertical: 0,
  },
  nameItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  nameText: {
    fontSize: 24,
    color: "#333",
    textAlign: "center",
    fontFamily: "serif", // To match the newspaper style
  },
  errorText: {
    color: "#333",
    textAlign: "center",
    padding: 20,
  },
  animatedStyle: {
    position: "absolute",
    width: "100%",
  },
  pressableContainer: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
  },
  plusButton: {
    position: "fixed",
    right: 30,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2e2e2e",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1,
  },
  plusButtonText: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
    lineHeight: 56, // Center the + vertically
  },
  bottomSheetContent: {
    flex: 1,
    padding: 16,
  },
  bottomSheetTitle: {
    marginBottom: 8,
    textAlign: "center",
  },
  bottomSheetDescription: {
    marginBottom: 24,
    textAlign: "center",
    opacity: 0.7,
  },
  contentContainer: {
    flex: 1,
    zIndex: 0,
  },
});
