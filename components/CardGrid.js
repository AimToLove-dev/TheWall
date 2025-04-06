"use client";

import { View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";

export const CardGrid = ({
  cards = [],
  style,
  gap = 16,
  direction = "row",
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: direction,
          justifyContent: "center",
          width: "100%",
          gap,
        },
        style,
      ]}
    >
      {cards.map((card, index) => (
        <Card
          key={index}
          onPress={card.onPress}
          mode="elevated"
          style={{
            width: 150,
            height: 150,
          }}
          contentStyle={{
            padding: 16,
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Card.Cover
            source={card.image}
            style={{
              width: 120,
              height: 70,
              backgroundColor: "transparent",
            }}
            resizeMode="contain"
          />
          <Text
            style={{
              color: theme.colors.onSurface,
              fontWeight: "bold",
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            {card.text}
          </Text>
        </Card>
      ))}
    </View>
  );
};
