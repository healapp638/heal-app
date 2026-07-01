import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setModulePhase,
  setModuleIsLastPhase,
} from '../../../../redux/Reducers/tempData';
import {
  View,
  FlatList,
  BackHandler,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {
  useNavigation,
  useTheme,
  useFocusEffect,
} from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import PhaseCard from '../../../../components/PhaseCard';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import useGetApi from '../../../../hooks/useGetApi';
import usePostApi from '../../../../hooks/usePostApi';
import { endpoints } from '../../../../api/Services/endpoints';
import { triggerHaptic } from '../../../../hooks/useHaptic';
const StartedModule = () => {
  const dispatch = useDispatch();
  const subModule = useSelector((state: any) => state.tempData.moduleSubModule);
  const { colors } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const navigation = useNavigation();
  const [phases, setPhases] = useState<any[]>([]);
  const [subModuleDetail, setSubModuleDetail] = useState<any>(subModule);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { mutate: startLesson, isPending: isStarting } = usePostApi();
  const { data, isLoading, refetch } = useGetApi(
    endpoints.phase_list,
    ['phase_list', subModule?._id],
    {
      sub_module_id: subModule?._id,
      limit: 100,
    },
  );
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );
  useEffect(() => {
    if (data?.data) {
      const responseData = data.data;
      if (responseData.subModule) {
        setSubModuleDetail(responseData.subModule);
      }
      const fetchedPhases = (responseData.phases || []).map(
        (p: any, index: number) => ({
          ...p,
          phaseNumber: index + 1,
        }),
      );
      setPhases(fetchedPhases);
    }
    setIsRefreshing(false);
  }, [data]);
  const onRefresh = () => {
    setIsRefreshing(true);
    refetch();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };
  const renderHeader = useCallback(
    () => (
      <>
        <View style={styles.headerTextContainer}>
          <SolidText
            style={[
              styles.title,
              {
                color: colors.brown,
              },
            ]}
          >
            {subModuleDetail?.title ||
              localization.appkeys?.trueFriendshipTitle ||
              'What is a True Friendship?'}
          </SolidText>
          <SolidText
            style={[
              styles.subtitle,
              {
                color: colors.brown,
              },
            ]}
          >
            {subModuleDetail?.description ||
              localization.appkeys?.trueFriendshipDesc ||
              'We often say we have friends — but what does that really mean?'}
          </SolidText>
        </View>

        {/* Progress Circles */}
        {phases.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.progressRowContainer}
            contentContainerStyle={styles.progressRowContent}
          >
            {phases.map((phaseItem, index) => {
              const isCompleted = phaseItem?.isCompleted;
              const step = index + 1;
              return (
                <React.Fragment
                  key={phaseItem?._id ? `${phaseItem._id}_${index}` : step}
                >
                  <View style={styles.circleContainer}>
                    <View
                      style={
                        isCompleted
                          ? styles.circleActive
                          : styles.circleInactive
                      }
                    >
                      <SolidText
                        style={
                          isCompleted
                            ? styles.circleTextActive
                            : styles.circleTextInactive
                        }
                      >
                        {step}
                      </SolidText>
                    </View>
                  </View>
                  {index < phases.length - 1 && (
                    <View
                      style={[styles.line, isCompleted && styles.lineActive]}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </ScrollView>
        )}

        <SolidText
          style={[
            styles.sectionTitle,
            {
              color: colors.brown,
            },
          ]}
        >
          {localization.appkeys?.phases || 'Phases'}
        </SolidText>
      </>
    ),
    [styles, subModuleDetail, localization.appkeys, colors.brown, phases],
  );
  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      const isLocked = item?.isLocked;
      return (
        <PhaseCard
          phase={`${localization.appkeys?.phase || 'Phase'} ${
            item.phaseNumber
          }`}
          title={item.title}
          points={`${item.points || 0} ${localization.appkeys?.pts || 'Pts'}`}
          isLocked={isLocked}
          isCompleted={item.isCompleted}
          onPress={() => {
            if (isStarting) return;
            if (!isLocked && !item.isCompleted) {
              triggerHaptic('impactMedium');
              startLesson(
                {
                  endpoint: endpoints.start_lesson,
                  data: {
                    phase_id: item?._id,
                  },
                },
                {
                  onSuccess: () => {
                    dispatch(setModulePhase(item));
                    dispatch(setModuleIsLastPhase(index === phases.length - 1));
                    (navigation.navigate as any)(AppRoutes.ModuleExercise);
                  },
                },
              );
            }
          }}
        />
      );
    },
    [
      localization.appkeys,
      navigation,
      phases.length,
      startLesson,
      isStarting,
      dispatch,
    ],
  );
  const keyExtractor = useCallback(
    (item: any, index: number) => index.toString(),
    [],
  );
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.goBack();
        return true;
      },
    );
    return () => backHandler.remove();
  }, [navigation]);
  return (
    <SolidView
      view={
        <View style={styles.mainContainer}>
          <View style={{ paddingHorizontal: 20 }}>
            <HeaderCommon
              title={localization.appkeys?.tabModules || 'Modules'}
              viewStyle={{ marginBottom: -2 }}
            />
          </View>
          {isLoading && phases.length === 0 ? (
            <ActivityIndicator
              size="large"
              color={colors.brown}
              style={{ flex: 1, justifyContent: 'center' }}
            />
          ) : (
            <FlatList
              data={phases}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              ListHeaderComponent={renderHeader}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={10}
              removeClippedSubviews={true}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                />
              }
            />
          )}
        </View>
      }
    />
  );
};
export default StartedModule;
