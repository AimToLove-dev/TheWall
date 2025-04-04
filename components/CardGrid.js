import { View, StyleSheet, TouchableOpacity, Image } from "react-native"
import { BodyText } from "./Typography"
import { getThemeColors, spacing, shadows } from "../styles/theme"
import { useColorScheme } from "react-native"

/**
 * CardGrid component that renders a grid of cards based on provided data
 *
 * @param {Object} props
 * @param {Array} props.cards - Array of card data objects
 * @param {Object} props.style - Additional styles for the container
 * @param {number} props.gap - Gap between cards (defaults to spacing.md)
 * @param {string} props.direction - Direction of the grid ('row' or 'column')
 */
export const CardGrid = ({ cards = [], style, gap = spacing.md, direction = "row" }) => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const colors = getThemeColors(isDark)

  return (
    <View style={[styles.cardsContainer, { gap, flexDirection: direction }, style]}>
      {cards.map((card, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.card, { backgroundColor: colors.primary }]}
          onPress={card.onPress}
          activeOpacity={0.8}
        >
          <Image source={card.image} style={styles.cardImage} resizeMode="contain" />
          <BodyText style={styles.cardText}>{card.text}</BodyText>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: spacing.lg,
  },
  card: {
    width: 150,
    height: 150,
    borderRadius: 12,
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#3f162",
    padding: spacing.md,
    ...shadows.medium,
  },
  cardImage: {
    width: 120,
    height: 70,
    marginBottom: spacing.sm,
  },
  cardText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
})

