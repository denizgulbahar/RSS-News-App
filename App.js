import { useState,useEffect,useRef } from 'react';
import { StyleSheet, Text, View,FlatList,TouchableOpacity,ScrollView,Image,Dimensions } from 'react-native';
import { parseString } from 'xml2js';
import FullScreenLoading from "./component/loading/FullScreenLoading"
import {WebView }from 'react-native-webview';
import CloseButton from './component/closeButton';

export default function App() {
  const width = Dimensions.get('window').width;
  const[data,setData] = useState([])
  const[isLoading,setIsLoading] = useState(true)
  const[selectedURL,setSelectedURL] = useState("")
  const[openWeb,setOpenWeb] = useState(false)
  const [message,setMessage] = useState("")
  async function getXMLResponse(url) {
    try {
      const response = await fetch(url, {
        method: 'GET',
      });
      if (response.ok) {
        const text = await response.text();
        return new Promise((resolve, reject) => {
          parseString(text, (err, result) => {
            if (err) {
              console.error('XML ayrıştırma hatası:', err);
              reject(err);
            } else {
              const channel = result.rss.channel;
              resolve(channel)
            }
          });
        });
      } else {
        console.error('İstek başarısız oldu. Durum kodu:', response.status);
      }
    } catch (error) {
      console.error('Bir hata oluştu:', error);
    }
  }
  async function getXMLResponse2(url) {
    try {
      const response = await fetch(url, {
        method: 'GET',
      });
      if (response.ok) {
        const text = await response.text();
        return new Promise((resolve, reject) => {
          parseString(text, (err, result) => {
            if (err) {
              console.error('XML ayrıştırma hatası:', err);
              reject(err);
            } else {
              const feedData = result.feed;
              resolve(feedData);
            }
          });
        });
      } else {
        console.error('İstek başarısız oldu. Durum kodu:', response.status);
      }
    } catch (error) {
      console.error('Bir hata oluştu:', error);
    }
  }
  
  const fetchData = async () => {
    try {
      const result = await getXMLResponse(data1[0].url);
      setData(prev => [...prev, result]);
    } catch (error) {
      console.error('Hata:', error);
    }
  };
  const fetchData2 = async () => {
    try {
      const results = await Promise.all(data2.map(async (field) => {
        try {
          return await getXMLResponse2(field.url);
        } catch (error) {
          console.error('Hata:', error);
          return false;
        }
      }));
  
      const filteredResults = results.filter(result => result !== false);
      setData(prev => [...prev, ...filteredResults]);
    } catch (error) {
      console.error('Bir hata oluştu:', error);
    }
  };
  useEffect(() => {
    setMessage("Haberler Yükleniyor, lütfen bekleyiniz...")
    const fetchDataAll = async () => {
      await fetchData(); 
      await fetchData2(); 
      setIsLoading(false)
  }
    fetchDataAll()
    setData([])
    },[])

  const data1 = [
    { id: '1',url: 'http://www.bbc.co.uk/turkce/index.xml' },
  ]
  const data2 = [
  { id: '2', url: 'http://www.bbc.co.uk/turkce/ekonomi/index.xml' },
  { id: '3', url: 'http://www.bbc.co.uk/turkce/ozeldosyalar/index.xml' },
  { id: '4', url: 'http://www.bbc.co.uk/turkce/basinozeti/index.xml' },
  { id: '5', url: 'http://www.bbc.co.uk/turkce/multimedya/index.xml' },
];

const navigateToURL = (url) => {
  setMessage("Haber açılıyor...")
  setIsLoading(true);
  setSelectedURL(url);
  setOpenWeb(true);
  setTimeout(() => {
    setIsLoading(false);
  }, 1000); 
};

const renderItem1 = ({ item,index }) => {
  const imageUrl = item.image[0].url[0]
  const title = item.item[0].title[0]
  const link = item.item[0].link[0]
  let titleSliced = title ? title.length >= 40 ? title.slice(0,40) + "..." : title : ""
  const description = item.item[0].description[0]
  let descriptionSliced = description ? description.length >= 40 ? description.slice(0, 40) + "..." : description : ""
  return(
<View key={index} >
    <TouchableOpacity onPress={() => navigateToURL(link) }>
      <View style={styles.item}>
        <Image source={{ uri: imageUrl }}
        style={styles.logo}
        resizeMode="contain"
        />
        <Text style={styles.title}>{titleSliced}</Text>
        <Text style={styles.description}>{descriptionSliced}</Text>
      </View>
    </TouchableOpacity>
  </View>
  )
}
const createRenderItem = (index) => ({ item }) => {
  const imageUrl = item.entry?.[index]?.link?.[0]?.["media:content"]?.[0]?.["media:thumbnail"]?.[0]?.["$"]?.url;
  const title = item?.entry?.[index]?.title?.[0]?.["_"]
  let titleSliced = title ? title.length >= 40 ? title.slice(0,40) + "..." : title : ""
  const description = item?.entry?.[index]?.summary?.[0]?.["_"]
  let descriptionSliced = description ? description.length >= 50 ? description.slice(0, 50) + "..." : description : ""
  const link = item?.entry?.[index]?.link?.[0]?.["$"]?.href;
  return (
    <View>
      <TouchableOpacity onPress={() => navigateToURL(link)}>
        <View style={styles.item}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>{titleSliced}</Text>
          <Text style={styles.description}>{descriptionSliced}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
   if(isLoading) {
      return (<FullScreenLoading message={message} ></FullScreenLoading>)
    } else {
        if(openWeb) {
          return (
          <View style={{flex:1,paddingVertical:50,paddingHorizontal:30}}>
          <CloseButton onPress={() => setOpenWeb(false)}/>
          <WebView
          source={{ uri: selectedURL }}
          style={{flex:1}}
          /> 
          </View>
          )} else {
            return (
              <ScrollView contentContainerStyle={styles.container} horizontal={true}>
              <View style={{borderWidth:1}}>
              <Text style={styles.header}> General News</Text>
              <FlatList
                data={data[0]}
                key={(item) => item.id}
                keyExtractor={(item) => item.id}
                renderItem={(renderItem1)}
                style={styles.flatList}
              />
              </View>
              <View style={{borderWidth:1}}>
              <Text style={styles.header}>Economic News</Text>
              <FlatList
                data={data}
                key={(item) => item.id}
                keyExtractor={(item) => item.id}
                renderItem={(createRenderItem(1))}
                style={styles.flatList}
              />
              </View>
              <View style={{borderWidth:1}}>
              <Text style={styles.header}>Private Files News</Text>
              <FlatList
                data={data}
                key={(item) => item.id}
                keyExtractor={(item) => item.id}
                renderItem={(createRenderItem(2))}
                style={styles.flatList}
              />
              </View>
              <View style={{borderWidth:1}}>
              <Text style={styles.header}>Press Review News</Text>
              <FlatList
                data={data}
                key={(item) => item.id}
                keyExtractor={(item) => item.id}
                renderItem={(createRenderItem(3))}
                style={styles.flatList}
              />
              </View>
              <View style={{borderWidth:1}}>
              <Text style={styles.header}>Multimedia News</Text>
              <FlatList
                data={data}
                key={(item) => item.id}
                keyExtractor={(item) => item.id}
                renderItem={(createRenderItem(4))}
                style={styles.flatList}
              />
              </View>
              </ScrollView>
            )
          }
        }
    }

const styles = StyleSheet.create({
  container: {
   paddingVertical:60,
   paddingHorizontal:10,
   flexDirection:"row",
  },
  header:{
    textAlign: "center",
    height:40,
    backgroundColor:"#000",
    color:"#fff",
    fontSize:22
  },
  item: {
    width:150,
    height:250,
    padding:20,
    margin:20,
    textAlign: 'center',
    borderWidth:1,
    borderRadius:20,
    borderColor: '#ccc',
  },
  logo: {
    height: 50,
    width: 50,
    borderRadius:25,
    alignSelf: 'center',
    backgroundColor:"blue",
  },
  flatList: {
    margin:10,
    backgroundColor:"blue"
  },
  title:{
  textAlign: 'center',
  fontSize:15,
  color:"white",
  padding:5,
  },
  description:{
  textAlign: 'center',
  fontSize:12,
  color:"white",
  padding:5
  }
});
