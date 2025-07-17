import { Fragment, useEffect, useState } from "react";
import { FlatList, ScrollView, ToastAndroid, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { SkeletonLoader, useLoadingDialog } from "~/core/components";
import { MusicListItem } from "~/features/__shared__/components";
import { Music } from "~/models";
import { VirtualMusicPlayerService } from "~/services";
import { HostedBackendApi } from "~/api";
import moment from "moment";
import * as Localization from "expo-localization";
import { NativeBottomTabNavigationProp } from "@bottom-tabs/react-navigation";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TStackNavigationRoutes } from "~/navigation";
import { TBottomTabRoutes } from "~/navigation/BottomTabNavigation";

type TNavigation = CompositeNavigationProp<
  NativeBottomTabNavigationProp<TBottomTabRoutes, "HomeScreen">,
  NativeStackNavigationProp<TStackNavigationRoutes>
>;

const _year = moment().format("YYYY");
const _countryCodeBasedQueryTemplates: Record<string, string> = {
  AF: `${_year} popular music Afghanistan`,
  AR: `${_year} música argentina popular`,
  AT: `${_year} österreichische hits`,
  AU: `${_year} Australian top songs`,
  BD: `${_year} জনপ্রিয় বাংলা গান`,
  BE: `${_year} populaire muziek België`,
  BR: `${_year} músicas populares Brasil`,
  CA: `${_year} Canadian top music`,
  CH: `${_year} Schweizer Hits`,
  CN: `${_year} 华语流行歌曲`,
  CO: `${_year} canciones populares Colombia`,
  CZ: `${_year} české hity`,
  DE: `${_year} deutscher chart musik`,
  DK: `${_year} danske populære sange`,
  EC: `${_year} música popular Ecuador`,
  EG: `${_year} موسيقى مصرية شعبية`,
  ES: `${_year} éxitos España`,
  FI: `${_year} suomalaista suosikkimusiikkia`,
  FR: `${_year} musique populaire France`,
  GB: `${_year} UK top songs`,
  GR: `${_year} ελληνικά δημοφιλή τραγούδια`,
  HK: `${_year} 香港流行歌曲`,
  ID: `${_year} lagu populer Indonesia`,
  IE: `${_year} Irish top music`,
  IN: `${_year} Hindi trending songs`,
  IT: `${_year} musica italiana popolare`,
  JP: `${_year}年日本のヒット曲`,
  KR: `${_year} 한국 인기 노래`,
  LT: `${_year} populiariausi lietuviški hitai`,
  MX: `${_year} canciones populares México`,
  MY: `${_year} lagu popular Malaysia`,
  NL: `${_year} Nederlandse top muziek`,
  NO: `${_year} norske populære sanger`,
  NZ: `${_year} New Zealand top songs`,
  PK: `${_year} پاکستانی مقبول گانے`,
  PH: `${_year} pinakasikat na kanta Pilipinas`,
  PL: `${_year} polskie hity`,
  PT: `${_year} músicas populares Portugal`,
  RO: `${_year} muzică populară România`,
  RU: `${_year} популярные песни России`,
  SE: `${_year} svenska topplåtar`,
  SG: `${_year} popular songs Singapore`,
  TH: `${_year} เพลงไทยยอดนิยม`,
  TR: `${_year} popüler Türkçe şarkılar`,
  TW: `${_year} 台灣熱門歌曲`,
  UA: `${_year} популярні пісні Україна`,
  US: `${_year} US top music`,
  VN: `${_year} nhạc Việt Nam hay nhất`,
  ZA: `${_year} South Africa popular songs`,
};

export default function TrendingSongsList() {
  const [trendingMusics, setTrendingMusics] = useState<Music[] | undefined>(undefined);
  const loadingDialog = useLoadingDialog();
  const chunkedData = chunkArray(trendingMusics ?? [], 3);
  const theme = useTheme();
  const navigation = useNavigation<TNavigation>();

  function chunkArray(arr: Music[], size: number) {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, index) =>
      arr.slice(index * size, index * size + size)
    );
  }

  async function handleMusicPressAsync(music: Music) {
    try {
      loadingDialog.show("Fetching Streams");
      VirtualMusicPlayerService.setQueueType("PLAYLIST");
      await VirtualMusicPlayerService.playMusicAsync(music, trendingMusics);
      navigation.push("PlayerControllerScreen");
    } catch (error) {
      ToastAndroid.show((error as Error).message, ToastAndroid.SHORT);
    } finally {
      loadingDialog.dismiss();
    }
  }

  useEffect(() => {
    const locales = Localization.getLocales();
    let query = _countryCodeBasedQueryTemplates["US"];
    if (locales.length > 0) {
      const locale = locales[0];
      if (
        locale.regionCode &&
        Object.keys(_countryCodeBasedQueryTemplates).includes(locale.regionCode)
      ) {
        query = _countryCodeBasedQueryTemplates[locale.regionCode];
      }
    }

    HostedBackendApi.searchMusicsAsync(query)
      .then(setTrendingMusics)
      .catch(() => {
        setTrendingMusics([]);
      });
  }, []);

  return (
    <View>
      {trendingMusics === undefined && (
        <ScrollView
          horizontal
          contentContainerStyle={{ gap: 16 }}
          showsHorizontalScrollIndicator={false}
        >
          {new Array(2).fill("-").map((it, index) => {
            return (
              <View style={{ gap: 16 }} key={index.toString()}>
                {new Array(3).fill("-").map((it, index) => {
                  return (
                    <SkeletonLoader
                      key={index.toString()}
                      height={70}
                      width={300}
                      cornerRadius={40}
                      colors={["transparent", theme.colors.inversePrimary, "transparent"]}
                      primaryBackground={theme.colors.secondaryContainer}
                    />
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      )}

      {trendingMusics && (
        <Fragment>
          <Text
            variant="titleLarge"
            style={{ color: theme.colors.primary, fontWeight: "bold", marginBottom: 16 }}
          >
            Latest Songs
          </Text>
          <FlatList
            data={chunkedData}
            horizontal
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{ gap: 16 }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={{ flexDirection: "column", gap: 16 }}>
                {item.map((music, idx) => (
                  <View
                    key={music.videoId}
                    style={{
                      backgroundColor: theme.colors.secondaryContainer,
                      borderRadius: 40,
                      overflow: "hidden",
                      marginBottom: 10,
                      width: 300,
                    }}
                  >
                    <MusicListItem onPress={handleMusicPressAsync} music={music} />
                  </View>
                ))}
              </View>
            )}
          />
        </Fragment>
      )}
    </View>
  );
}
