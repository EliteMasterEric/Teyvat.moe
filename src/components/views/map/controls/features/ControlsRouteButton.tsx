/**
 * Provides the interface for the individual routes
 * within the Routes tab of the Map controls.
 */

import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { MSFRouteGroupKey } from 'src/components/data/map/Element';

import { getMapRouteGroup } from 'src/components/data/map/MapRoutes';
import { localizeField } from 'src/components/i18n/map/FeatureLocalization';
import { getNextImageUrl, NextImage } from 'src/components/interface/Image';
import { AppDispatch } from 'src/components/redux';
import { toggleRouteGroupDisplayed } from 'src/components/redux/slices/map/displayed/Actions';
import { selectIsRouteGroupDisplayed } from 'src/components/redux/slices/map/displayed/Selector';

import { selectOverrideLang } from 'src/components/redux/slices/map/options/Selector';
import { AppState } from 'src/components/redux/Types';

interface StyleProps {
  bgImage: string;
}
const useStyles = makeStyles((_theme) => ({
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
  routeRoot: {
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
  routeRootActive: {
    background:
      'linear-gradient(270deg, rgba(171, 143, 119, 0.5) -46.99%, rgba(143, 110, 76, 0.5) 198.5%), #ab8f77',
    color: '#f2f0ee',
  },
}));

interface ControlsRouteButtonBaseProps {
  routeKey: MSFRouteGroupKey;
}

const mapStateToProps = (state: AppState, { routeKey }: ControlsRouteButtonBaseProps) => ({
  active: selectIsRouteGroupDisplayed(state, routeKey),
  // Adding language to the props, even if it isn't used,
  // causes the component to re-render when the language changes.
  lang: selectOverrideLang(state),
});
const mapDispatchToProps = (dispatch: AppDispatch, { routeKey }: ControlsRouteButtonBaseProps) => ({
  toggleRouteDisplayed: () => dispatch(toggleRouteGroupDisplayed(routeKey)),
});
type ControlsRouteButtonStateProps = ReturnType<typeof mapStateToProps>;
type ControlsRouteButtonDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<
  ControlsRouteButtonStateProps,
  ControlsRouteButtonDispatchProps,
  ControlsRouteButtonBaseProps,
  AppState
>(mapStateToProps, mapDispatchToProps);

type ControlsRouteButtonProps = ConnectedProps<typeof connector> & ControlsRouteButtonBaseProps;

/**
 * A button in the Filters, with the icon of a Map route on it.
 * Pressing this toggles display of that Map route.
 */
const _ControlsRouteButton: FunctionComponent<ControlsRouteButtonProps> = ({
  routeKey,
  active,
  toggleRouteDisplayed,
}) => {
  const classes = useStyles({
    bgImage: getNextImageUrl('/images/controls/filter_border.png', 80, 80),
  });

  const mapRoute = getMapRouteGroup(routeKey);

  // Hide button if route is not enabled.
  if (!mapRoute.enabled ?? true) return null;

  return (
    <Box
      onClick={toggleRouteDisplayed}
      className={clsx(classes.routeRoot, classes.noselect, active ? classes.routeRootActive : null)}
    >
      <Box className={classes.iconBorder}>
        <NextImage
          src={`/images/icons/filter/${mapRoute.icons.filter}.png`}
          className={classes.icon}
          width={70}
          height={70}
        />
      </Box>
      <Typography>{localizeField(mapRoute.name)}</Typography>
    </Box>
  );
};

const ControlsRouteButton = connector(_ControlsRouteButton);

export default ControlsRouteButton;
