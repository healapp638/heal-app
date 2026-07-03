/*
 * MEMORY & PERFORMANCE REFACTOR SUMMARY:
 * - useCallbacks added: 2 (onRefresh, PhaseListItem.handlePress)
 * - useMemos added: 6 (queryKeys, queryParams, queryOptions, paddingStyle, headerViewStyle, headerTitle)
 * - Components extracted: 3
 *   1. src/components/StartedModuleHeader.tsx
 *   2. src/components/ProgressCircleItem.tsx
 *   3. src/components/PhaseListItem.tsx
 * - Memory leak fixes applied: 1 (clearTimeout on unmount for onRefresh)
 */

import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';
import {
  View,
  FlatList,
  BackHandler,
  RefreshControl,
  InteractionManager,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  useNavigation,
  useTheme,
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native';

import {
  setModulePhase,
  setModuleIsLastPhase,
  setExerciseJustCompleted,
} from '../../../../redux/Reducers/tempData';
import SolidView from '../../../../components/SolidView';
import HeaderCommon from '../../../../components/HeaderCommon';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import useGetApi from '../../../../hooks/useGetApi';
import { endpoints } from '../../../../api/Services/endpoints';
import { triggerHaptic } from '../../../../hooks/useHaptic';
import Loader from '../../../../modals/Loader';

// Extracted Components
import StartedModuleHeader from '../../../../components/StartedModuleHeader';
import PhaseListItem from '../../../../components/PhaseListItem';

// Constants
const INITIAL_NUM_TO_RENDER = 4;
const MAX_TO_RENDER_PER_BATCH = 4;
const WINDOW_SIZE = 5;

const StartedModule = () => {
  // Refs
  const hasStartedFetching = useRef(false);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // State
  const dispatch = useDispatch();
  const subModule = useSelector((state: any) => state.tempData.moduleSubModule);
  const exerciseJustCompleted = useSelector(
    (state: any) => state.tempData.exerciseJustCompleted,
  );

  const [subModuleDetail, setSubModuleDetail] = useState<any>(subModule);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Memoized derived values
  const { colors } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = useMemo(() => style(colors), [colors]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const queryKeys = useMemo(
    () => ['phase_list', subModule?._id],
    [subModule?._id],
  );
  const queryParams = useMemo(
    () => ({
      sub_module_id: subModule?._id,
      limit: 100,
    }),
    [subModule?._id],
  );
  const queryOptions = useMemo(
    () => ({
      enabled: isFocused && !!subModule?._id,
      gcTime: 30000,
      staleTime: 10000,
    }),
    [isFocused, subModule?._id],
  );

  const { data, isLoading, isFetching, isError, refetch } = useGetApi(
    endpoints.phase_list,
    queryKeys,
    queryParams,
    queryOptions,
  );

  const phases = useMemo(() => {
    const responsePhases = data?.data?.phases || [];
    return responsePhases.map((p: any, index: number) => ({
      ...p,
      phaseNumber: index + 1,
    }));
  }, [data?.data?.phases]);

  const paddingStyle = useMemo(() => ({ paddingHorizontal: 20 }), []);
  const headerViewStyle = useMemo(() => ({ marginBottom: -2 }), []);
  const headerTitle = useMemo(
    () => localization.appkeys?.tabModules || 'Modules',
    [localization.appkeys?.tabModules],
  );

  // Callbacks
  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    refetch();
    refreshTimeoutRef.current = setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  }, [refetch]);

  const handlePhasePress = useCallback(
    (item: any, index: number) => {
      if (!item?.isLocked && !item.isCompleted) {
        triggerHaptic('impactMedium');
        dispatch(setModulePhase(item));
        dispatch(setModuleIsLastPhase(index === phases.length - 1));
        (navigation.navigate as any)(AppRoutes.ModuleExercise);
      }
    },
    [dispatch, navigation, phases.length],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      return (
        <PhaseListItem
          item={item}
          index={index}
          localization={localization}
          onPress={handlePhasePress}
        />
      );
    },
    [localization, handlePhasePress],
  );

  const keyExtractor = useCallback(
    (item: any, index: number) => index.toString(),
    [],
  );

  // Effects
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isFetching) {
      hasStartedFetching.current = true;
    }
  }, [isFetching]);

  useEffect(() => {
    if (!isFetching && hasStartedFetching.current && exerciseJustCompleted) {
      const timer = setTimeout(() => {
        dispatch(setExerciseJustCompleted(false));
      }, 1000);
      hasStartedFetching.current = false;
      return () => clearTimeout(timer);
    }
  }, [isFetching, exerciseJustCompleted, dispatch]);

  useEffect(() => {
    if (data?.data) {
      const responseData = data.data;
      if (responseData.subModule) {
        setSubModuleDetail(responseData.subModule);
      }
    }
    setIsRefreshing(false);
  }, [data]);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setIsReady(true);
      });
      return () => {
        task.cancel();
      };
    }, []),
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

  if (!isReady) {
    return null;
  }

  return (
    <SolidView
      view={
        <View style={styles.mainContainer}>
          <View style={paddingStyle}>
            <HeaderCommon title={headerTitle} viewStyle={headerViewStyle} />
          </View>
          <FlatList
            data={phases}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListHeaderComponent={
              <StartedModuleHeader
                subModuleDetail={subModuleDetail}
                phases={phases}
                localization={localization}
                colors={colors}
                styles={styles}
              />
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            initialNumToRender={INITIAL_NUM_TO_RENDER}
            maxToRenderPerBatch={MAX_TO_RENDER_PER_BATCH}
            windowSize={WINDOW_SIZE}
            removeClippedSubviews={true}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          />
          {isFetching &&
            phases.length > 0 &&
            !isRefreshing &&
            exerciseJustCompleted && <Loader />}
        </View>
      }
    />
  );
};

export default StartedModule;
