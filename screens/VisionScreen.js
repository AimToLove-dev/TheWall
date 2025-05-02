import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { ScrollableScreenView } from "components/views/ScrollableScreenView";
import { DashboardHeader } from "components/dashboard/DashboardHeader";
import { useNavigation } from "@react-navigation/native";
import { getThemeColors } from "styles/theme";
import { BodyText } from "components";

const { width } = Dimensions.get("window");

export const VisionScreen = () => {
  const navigation = useNavigation();
  const colors = getThemeColors();

  const handleBackPress = () => {
    navigation.navigate("Home");
  };

  return (
    <ScrollableScreenView>
      <View style={styles.container}>
        <DashboardHeader
          title="Our Vision"
          subtitle="A Holy Revolution for the LGBTQ+ Community"
          onBackPress={handleBackPress}
          colors={colors}
          showSignOut={false}
        />
        <View style={styles.contentContainer}>
          {/* Vision Banner Image */}
          <Image
            source={require("assets/pillars.png")}
            style={styles.bannerImage}
            resizeMode="cover"
            accessible={true}
            accessibilityLabel="The Wall Vision Banner"
          />

          {/* Main Vision Content */}
          <View style={styles.textContentContainer}>
            <Text style={styles.visionTitle}>The Holy Revolution</Text>

            <BodyText style={styles.paragraph}>
              Monet Beltran saw a vision of a Holy Revolution--doors of the
              Church bursting open as the LGBTQ+ flooded in. She believes the
              Lord has commissioned her saying
            </BodyText>

            <Text style={styles.highlightText}>
              "Prepare a banquet table for the LGBTQ+."
            </Text>

            <BodyText style={styles.paragraph}>
              <Text style={styles.boldText}>The Wall is that Table</Text>
              {"\n"}A place to love, pray, and evangelize the LGBTQ+ community.
            </BodyText>

            <View style={styles.divider} />

            <BodyText style={styles.paragraph}>
              We envision a space where the Church and the LGBTQ+ community can
              meet in love, understanding, and genuine connection. Our mission
              is built on three pillars:
            </BodyText>

            <View style={styles.pillarContainer}>
              <Text style={styles.pillarTitle}>LOVE</Text>
              <BodyText style={styles.pillarDescription}>
                Creating spaces of authentic connection where the LGBTQ+
                community experiences the unconditional love of Christ through
                His people.
              </BodyText>
            </View>

            <View style={styles.pillarContainer}>
              <Text style={styles.pillarTitle}>PRAY</Text>
              <BodyText style={styles.pillarDescription}>
                Standing in the gap through intercession, believing for God's
                transformative work in the lives of individuals in the LGBTQ+
                community.
              </BodyText>
            </View>

            <View style={styles.pillarContainer}>
              <Text style={styles.pillarTitle}>EVANGELIZE</Text>
              <BodyText style={styles.pillarDescription}>
                Sharing the Gospel with compassion and truth, inviting the
                LGBTQ+ community into a relationship with Jesus that brings
                wholeness and purpose.
              </BodyText>
            </View>

            <View style={styles.divider} />

            <BodyText style={[styles.paragraph, styles.closingText]}>
              The Wall is not just a ministry - it's a movement. A Holy
              Revolution that seeks to build bridges between the Church and the
              LGBTQ+ community, creating pathways for healing, reconciliation,
              and transformation.
            </BodyText>
          </View>
        </View>
      </View>
    </ScrollableScreenView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  bannerImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  textContentContainer: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  visionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#3e477d",
    fontFamily: "XTypewriter-Bold",
  },
  paragraph: {
    marginVertical: 10,
    textAlign: "justify",
    lineHeight: 22,
  },
  highlightText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#3e477d",
    margin: 15,
    padding: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#3e477d",
    backgroundColor: "#f0f0f0",
    fontFamily: "XTypewriter-Bold",
  },
  boldText: {
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 20,
  },
  pillarContainer: {
    marginVertical: 10,
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 8,
  },
  pillarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3e477d",
    marginBottom: 5,
    fontFamily: "XTypewriter-Bold",
  },
  pillarDescription: {
    lineHeight: 20,
  },
  closingText: {
    fontStyle: "italic",
  },
  scriptureImage: {
    width: "100%",
    height: 100,
    marginTop: 20,
  },
});
