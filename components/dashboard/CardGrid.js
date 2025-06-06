"use client";

import { View } from "react-native";
import { Card, Text } from "react-native-paper";
import { getThemeColors } from "styles/theme";

export const CardGrid = ({
  cards = [],
  style,
  gap = 16,
  direction = "row",
}) => {
  const colors = getThemeColors();

  return (
    <View
      style={[
        {
          flexDirection: direction,
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
            borderRadius: 0,
            justifyContent: "center",
          }}
          contentStyle={{
            padding: 16,
            justifyContent: "space-evenly",
            alignItems: "center",
            height: "100%",
          }}
        >
          {card.icon && <View>{card.icon}</View>}

          <Text
            style={{
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
