import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
  Dimensions,
} from "react-native";
import { HeaderText, BodyText, CustomButton, CaptionText } from "components";

export const MainContent = ({
  navigateToWailingWall,
  navigateToTestimonyWall,
}) => {
  const screenWidth = Dimensions.get("window").width;
  return (
    <View
      style={{
        padding: 20,
        maxWidth: Math.min(screenWidth, 800),
        marginHorizontal: "auto",
      }}
    >
      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Two Column News Section */}
        <View style={styles.twoColumnSection}>
          <View style={styles.columnLeft}>
            <Text style={styles.columnNumber}>COLUMN 3</Text>
            <HeaderText style={styles.columnTitle}>
              A Sacred Space for Lifting Up the Lost
            </HeaderText>
            <View style={styles.imageContainer}>
              <Image
                source={require("../assets/megaphone.png")}
                style={styles.storyImage}
                resizeMode="contain"
              />
            </View>
            <BodyText>By Sarah Chen, Technology Reporter</BodyText>
            <BodyText style={styles.firstCharDropCap}>
              The Wailing Wall — is a sanctuary of intercession, where the
              faithful gather to pray fervently for those who have yet to come
              to know the saving grace of Christ. It is a sacred place where
              prayers ascend like incense, carrying the hopes and burdens of the
              lost.
            </BodyText>
            <BodyText>
              This wall is not only a symbol of sorrow but of hope. It
              represents the deep desire of the Church to see lives transformed,
              hearts healed, and souls brought into the fullness of God's love.
              Through prayer, we believe that the chains of sin will be broken,
              and those who are lost will be found by the loving arms of Jesus.
            </BodyText>
            <CustomButton
              title="Visit the Wailing Wall"
              onPress={navigateToWailingWall}
              variant="primary"
            />
          </View>

          <View style={styles.columnRight}>
            <Text style={styles.columnNumber}>COLUMN 4</Text>
            <HeaderText style={styles.columnTitle}>
              Sharing the Glory of God's Transformative Power
            </HeaderText>
            <BodyText>By Michael Rodriguez, Financial Correspondent</BodyText>
            <BodyText style={styles.firstCharDropCap}>
              The Testimony Wall — stands as a living testament to the
              miraculous work of Jesus Christ in the lives of individuals who
              have walked away from the LGBT lifestyle. Each story shared on
              this wall is a radiant declaration of God's unending love and
              redemptive power. These testimonies shine like beacons of hope,
              lighting the way for others to come to the knowledge of truth and
              salvation.
            </BodyText>
            <BodyText>
              As people share their personal journeys of transformation, the
              Testimony Wall becomes a source of inspiration, reminding all who
              see it that no soul is beyond God's reach. It is a place where the
              beauty of salvation is magnified, and the glory of God's grace is
              revealed in the lives of those who were once lost but are now
              found in Christ. Every story is a victory, a triumph of love over
              sin, and a celebration of God's miraculous power to restore and
              renew.
            </BodyText>

            <CustomButton
              title="Visit the Testimony Wall"
              onPress={navigateToTestimonyWall}
              variant="primary"
            />

            {/* Vintage Advertisement */}
            {/* <View style={styles.vintageAd}>
              <Text style={styles.vintageAdHeader}>Advertisement</Text>
              <BodyText style={styles.vintageAdTitle}>
                PARKER FOUNTAIN PENS
              </BodyText>
              <CaptionText>The Mark of Quality Writing Since 1888</CaptionText>
              <CaptionText style={styles.vintageAdPrice}>
                Available at fine stationers everywhere
              </CaptionText>
            </View> */}
          </View>
        </View>

        {/* Lead Story */}
        <View style={styles.leadStoryContainer}>
          <View style={styles.leadStoryLeft}>
            <View style={styles.columnHeaders}>
              <Text style={styles.columnNumber}>COLUMN 1</Text>
              <Text style={styles.columnNumber}>COLUMN 2</Text>
            </View>
            <HeaderText style={styles.leadStoryTitle}>
              A Divine Invitation
            </HeaderText>
            <View style={styles.twoColumnText}>
              <BodyText style={styles.boldText}>
                The Wall (.love) is not just an initiative; it is a sacred
                invitation to reclaim those who have been cast aside, to restore
                the brokenhearted, and to bring healing to the LGBT community
                through the boundless love of Christ.
              </BodyText>
              <BodyText>
                <small>By James Wilson, Diplomatic Correspondent</small>
              </BodyText>
              <BodyText>
                THE WALL — is a place where God's grace flows like a river,
                welcoming individuals into a space of repentance, restoration
                and new beginnings. Here, love transcends labels, and every
                person is seen with the eyes of God, deserving of His tender
                mercy.
              </BodyText>
              <BodyText>
                This movement is a powerful call to overcomers—those who,
                through the grace of Jesus, are stepping out of the darkness of
                sin and into the light of salvation. The Wall (.love) offers a
                haven where healing can take place, where the weary find rest,
                and where those lost in sin can embrace the redemptive power of
                Jesus Christ. It is a place to encounter the life-changing love
                of God and embrace a new identity in Him.
              </BodyText>
              <BodyText style={styles.continuedText}>
                Continued on Page A6, Column 1
              </BodyText>
            </View>
          </View>
          <View style={styles.leadStoryRight}>
            <View style={styles.imageContainer}>
              <Image
                source={require("../assets/monet.png")}
                style={styles.storyImage}
                resizeMode="cover"
              />
            </View>
            <CaptionText style={styles.imageCaption}>
              Monet Beltran paving the way for a new movement of redemption and
              reconciliation in LGBT community.
            </CaptionText>

            <HeaderText style={styles.sectionTitle}>Related Stories</HeaderText>
            <View style={styles.relatedStories}>
              <TouchableOpacity>
                <BodyText style={styles.relatedStoryLink}>
                  Deciphering the Lingo: What is an Overcomer?
                </BodyText>
              </TouchableOpacity>
              <TouchableOpacity>
                <BodyText style={styles.relatedStoryLink}>
                  In the Breach: How can I make a difference?
                </BodyText>
              </TouchableOpacity>
              <TouchableOpacity>
                <BodyText style={styles.relatedStoryLink}>
                  Kingdom Impact: What does becoming a partner look like?
                </BodyText>
              </TouchableOpacity>
            </View>

            {/* Vintage Advertisement */}
            {/* <View style={styles.vintageAd}>
              <Text style={styles.vintageAdHeader}>Advertisement</Text>
              <BodyText style={styles.vintageAdTitle}>
                CARTER'S LITTLE LIVER PILLS
              </BodyText>
              <CaptionText>
                For Constipation, Biliousness, Headache & Indigestion
              </CaptionText>
              <CaptionText style={styles.vintageAdPrice}>
                25¢ at all druggists
              </CaptionText>
            </View> */}
          </View>
        </View>

        {/* Weather and Index - Two Columns */}
        <View style={styles.footerSection}>
          <View style={styles.footerColumn}>
            <HeaderText style={styles.footerTitle}>Weather</HeaderText>
            <View style={styles.weatherContent}>
              <CaptionText>
                Partly cloudy with a chance of afternoon showers.
              </CaptionText>
              <CaptionText>High: 72°F Low: 58°F</CaptionText>
              <CaptionText style={styles.marginTop}>
                Full forecast on Page D8
              </CaptionText>
            </View>
          </View>
          <View style={styles.footerColumn}>
            <HeaderText style={styles.footerTitle}>Index</HeaderText>
            <View style={styles.indexContent}>
              <CaptionText>Business...............B1</CaptionText>
              <CaptionText>Classifieds............D5</CaptionText>
              <CaptionText>Crossword.............E7</CaptionText>
              <CaptionText>Obituaries.............D4</CaptionText>
              <CaptionText>Opinion................A8</CaptionText>
              <CaptionText>Sports.................C1</CaptionText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Main content styles
  mainContent: {
    marginTop: 20,
  },
  leadStoryContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 20,
    marginBottom: 20,
  },
  leadStoryLeft: {
    flex: 3,
    paddingRight: 15,
  },
  leadStoryRight: {
    flex: 2,
    borderLeftWidth: 1,
    borderLeftColor: "#000",
    paddingLeft: 15,
  },
  columnHeaders: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  columnNumber: {
    fontSize: 10,
    color: "#666",
  },
  leadStoryTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 5,
    marginBottom: 10,
  },
  twoColumnText: {
    marginTop: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
  continuedText: {
    marginTop: 10,
    fontStyle: "italic",
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 2,
    marginVertical: 10,
  },
  storyImage: {
    width: "100%",
    height: 150,
  },
  imageCaption: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 5,
    marginBottom: 15,
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 5,
    marginBottom: 10,
  },
  relatedStories: {
    marginBottom: 20,
  },
  relatedStoryLink: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  vintageAd: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f9f9f0",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  vintageAdHeader: {
    textAlign: "center",
    fontSize: 10,
    color: "#666",
    marginBottom: 5,
  },
  vintageAdTitle: {
    fontWeight: "bold",
    textAlign: "center",
  },
  vintageAdPrice: {
    marginTop: 10,
    textAlign: "center",
    fontStyle: "italic",
  },
  // Two column section styles
  twoColumnSection: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 20,
    marginBottom: 20,
  },
  columnLeft: {
    flex: 1,
    paddingRight: 15,
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  columnRight: {
    flex: 1,
    paddingLeft: 15,
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 5,
    marginBottom: 10,
  },
  firstCharDropCap: {
    marginVertical: 10,
  },
  // Footer section styles
  footerSection: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingVertical: 15,
  },
  footerColumn: {
    flex: 1,
    paddingHorizontal: 10,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 5,
    marginBottom: 10,
  },
  weatherContent: {
    alignItems: "center",
  },
  indexContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  marginTop: {
    marginTop: 10,
  },
});
