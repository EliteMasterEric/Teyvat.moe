/**
 * Provides the interface for the individual features
 * within the Features tab of the Map controls.
 */

import { Box, Typography } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { MSFFeatureKey } from 'src/components/data/map/Element';

import { getMapFeature } from 'src/components/data/map/MapFeatures';
import { localizeField } from 'src/components/i18n/map/FeatureLocalization';
import { getNextImageUrl, NextImage } from 'src/components/interface/Image';
import { AppDispatch } from 'src/components/redux';
import { toggleFeatureDisplayed } from 'src/components/redux/slices/map/displayed/Actions';
import { selectIsFeatureDisplayed } from 'src/components/redux/slices/map/displayed/Selector';
import { selectOverrideLang } from 'src/components/redux/slices/map/options/Selector';
import { AppState } from 'src/components/redux/Types';

interface StyleProps {
  bgImage: string;
}
const useStyles = makeStyles(
  createStyles({
    iconBorder: {
      position: 'absolute',
      top: -1,
      left: -37,
      width: 80,
      height: 80,
      /* This URL MUST start with a '/' to indicate it is an absolute URL. */
      background: ({ bgImage }: StyleProps) => `url(${bgImage}) no-repeat`,
      backgroundSize: '100% 100%',
    },
    icon: {
      position: 'absolute',
      top: '2px !important',
      left: '2px !important',
      clipPath: 'circle(35px)',
    },
    noselect: {
      // Prevent selecting the text.
      '-webkit-touch-callout': 'none' /* iOS Safari */,
      '-webkit-user-select': 'none' /* Safari */,
      '-khtml-user-select': 'none' /* Konqueror HTML */,
      '-moz-user-select': 'none' /* Firefox */,
      '-ms-user-select': 'none' /* Internet Explorer/Edge */,
      'user-select': 'none' /* Non-prefixed version, currently
                                    supported by Chrome and Opera */,
    },
    featureRoot: {
      // Position relative so the frame image can be positioned absolutely.
      position: 'relative',
      // Make space for the image.
      margin: '0 0 10px 37px',
      width: 'calc(100% - 43px)',
      height: 74,
      // Prevent the box getting squished.
      flexShrink: 0,

      border: '1px solid #d2c6bb',
      cursor: 'pointer',
      color: '#78583d',

      background: 'linear-gradient(270deg, #ffffff -95.11%, rgba(255, 255, 255, 0) 100%), #f0e9e2',

      // Align the text.
      padding: '0 8px 0 48px',

      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',

      fontSize: 18,
      boxSizing: 'border-box',
    },
    featureRootActive: {
      background:
        'linear-gradient(270deg, rgba(171, 143, 119, 0.5) -46.99%, rgba(143, 110, 76, 0.5) 198.5%), #ab8f77',
      color: '#f2f0ee',
    },
  })
);

interface ControlsFeatureButtonBaseProps {
  featureKey: MSFFeatureKey;
}
const mapStateToProps = (state: AppState, { featureKey }: ControlsFeatureButtonBaseProps) => ({
  active: selectIsFeatureDisplayed(state, featureKey),
  // Adding language to the props, even if it isn't used,
  // causes the component to re-render when the language changes.
  lang: selectOverrideLang,
});
const mapDispatchToProps = (
  dispatch: AppDispatch,
  { featureKey }: ControlsFeatureButtonBaseProps
) => ({
  toggleFeatureDisplayed: () => dispatch(toggleFeatureDisplayed(featureKey)),
});
type ControlsFeatureButtonStateProps = ReturnType<typeof mapStateToProps>;
type ControlsFeatureButtonDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<
  ControlsFeatureButtonStateProps,
  ControlsFeatureButtonDispatchProps,
  ControlsFeatureButtonBaseProps,
  AppState
>(mapStateToProps, mapDispatchToProps);

type ControlsFeatureButtonProps = ConnectedProps<typeof connector> & ControlsFeatureButtonBaseProps;

/**
 * A button in the Filters, with the icon of a Map feature on it.
 * Pressing this toggles display of that Map feature.
 * @param {*} featureKey The key of the feature.
 */
const _ControlsFeatureButton: FunctionComponent<ControlsFeatureButtonProps> = ({
  featureKey,
  active,
  toggleFeatureDisplayed,
}) => {
  const classes = useStyles({
    bgImage: getNextImageUrl('/images/controls/filter_border.png', 80, 80),
  });

  const mapFeature = getMapFeature(featureKey);

  // Hide button if feature is not enabled.
  if (!mapFeature.enabled) return null;

  const filterImg = mapFeature.icons.filter;

  return (
    <Box
      onClick={toggleFeatureDisplayed}
      className={clsx(
        classes.featureRoot,
        classes.noselect,
        active ? classes.featureRootActive : null
      )}
    >
      <Box className={classes.iconBorder}>
        <NextImage
          src={`/images/icons/filter/${filterImg}.png`}
          className={classes.icon}
          width={70}
          height={70}
        />
      </Box>
      <Typography>{localizeField(mapFeature.name)}</Typography>
    </Box>
  );
};

const ControlsFeatureButton = connector(_ControlsFeatureButton);

export default ControlsFeatureButton;
