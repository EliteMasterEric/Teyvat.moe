import { makeStyles, Box, Typography, Tooltip, IconButton } from '@material-ui/core';
import { AssignmentTurnedIn as AssignmentTurnedInIcon, Link as LinkIcon } from '@material-ui/icons';
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { connect } from 'react-redux';

import { YOUTUBE_REGEX } from '~/components/data/MarkerDataFormatSchema';
import { displayUnixTimestamp, f, t } from '~/components/i18n/Localization';
import { createMapIcon } from '~/components/data/MapFeaturesData';
import { Image, useImageExtension } from '~/components/interface/Image';
import { localizeField } from '~/components/i18n/FeatureLocalization';
import YouTubeEmbed from '~/components/interface/YouTubeEmbed';
import { clearFeatureMarkerCompleted, setFeatureMarkerCompleted } from '~/redux/ducks/completed';
import { SafeHTML } from '~/components/Util';
import { copyPermalink } from '~/components/views/PermalinkHandler';
import { InputSwitch } from '~/components/interface/Input';

const POPUP_WIDTH = '560';

const useStyles = makeStyles((_theme) => ({
  popupContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& p': {
      // Improve specificity.
      margin: 0,
    },
  },
  actionContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  innerActionContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedSubtitle: {
    fontSize: 10,
    fontStyle: 'italic',
  },
  popupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  popupContent: {
    fontSize: 12,
  },
  popupMediaImage: {
    margin: '4px 0 4px 0',
    width: 192,
    height: 192,
  },
}));

const FeatureMedia = ({ media, allowExternalMedia }) => {
  const classes = useStyles();

  if (media == null || media === '') return null;

  const isExternal = media.match(/^http(s):\/\//);

  // An external image or link.
  if (isExternal) {
    // Is this a link to a YouTube video?
    const isYouTube = media.match(YOUTUBE_REGEX);
    if (isYouTube) {
      const match = YOUTUBE_REGEX.exec(media);
      if (match != null) {
        const videoId = match[1];
        return <YouTubeEmbed id={videoId} width={560} height={315} />;
      }
    }

    // Else, it's an external image.
    if (allowExternalMedia) {
      // Display external images in the editor,
      // since it is assumed this user submitted it.
      return <Image srcPNG={media} className={classes.popupMediaImage} />;
    }

    // Prevent displaying external images for security reasons.
    return <span>{media}</span>;
  }

  // Else, use an image from public/comments.
  return (
    <Image
      className={classes.popupMediaImage}
      srcPNG={`/comments/${media}.png`}
      srcWebP={`/comments/${media}.webp`}
    />
  );
};

const _FeatureMarker = ({
  marker,
  markerKey,
  icons,

  completed,
  completedAlpha,

  editable,

  markFeature,
  unmarkFeature,
  allowExternalMedia = false,
}) => {
  // CSS classes.
  const classes = useStyles();

  // WebP or PNG, based on support.
  const ext = useImageExtension();

  // Build the icon for this marker.
  // Relies on completion status.
  const icon = completed
    ? createMapIcon({
        ...icons?.done,
        ext: icons?.done?.svg ?? false ? 'svg' : ext,
        key: icons?.done?.key ?? icons?.filter,
        completed,
      })
    : createMapIcon({
        ...icons?.base,
        ext: icons?.base?.svg ?? false ? 'svg' : ext,
        key: icons?.base?.key ?? icons?.filter,
        completed,
      });

  const onSingleClick = (event) => {
    // Calls on single clicks, not double clicks.

    // Trigger the popup to display only on single clicks.
    event.target.openPopup();
  };

  const onDoubleClick = (_event) => {
    // Calls on double clicks, not single clicks.

    // Mark as completed.
    if (completed) {
      unmarkFeature();
    } else {
      markFeature();
    }
  };

  const DOUBLE_CLICK_TIMEOUT = 300;

  const onCopyPermalink = () => copyPermalink(marker.id);

  const onSwitchCompleted = (value) => {
    if (value === !!completed) return;

    if (value) {
      markFeature();
    } else {
      unmarkFeature();
    }
  };

  /* eslint-disable no-param-reassign */
  const eventHandlers = {
    add: (event) => {
      // We will be triggering popups manually.
      event.target.off('click', event.target._openPopup);
      if (editable) {
        event.target.enableEdit();
      }
    },
    click: (event) => {
      if (event.target.clicks === undefined) event.target.clicks = 0;

      event.target.clicks += 1;

      setTimeout(() => {
        if (event.target.clicks === 1) {
          onSingleClick(event);
        }
        event.target.clicks = 0;
      }, DOUBLE_CLICK_TIMEOUT);
    },
    dblclick: (event) => {
      event.target.clicks = 0;
      onDoubleClick(event);
    },
  };
  /* eslint-enable no-param-reassign */

  const title = localizeField(marker.popupTitle);
  const content = localizeField(marker.popupContent);

  return (
    <Marker
      eventHandlers={eventHandlers}
      position={marker?.coordinates}
      icon={icon}
      opacity={completed ? completedAlpha : 1}
      id={markerKey}
      completed={!!completed}
    >
      {/* A modern variant of MapPopupLegacy. */}
      <Popup maxWidth={540} minWidth={192} autoPan={false} keepInView={false}>
        <Box className={classes.popupContainer}>
          {title && title !== '' ? (
            <Typography className={classes.popupTitle}>{title}</Typography>
          ) : (
            <Typography className={classes.popupTitle}>
              {f('editor-elements-marker-id', { id: marker.id.substring(0, 7) })}
            </Typography>
          )}
          <Box>
            <FeatureMedia media={marker.popupMedia} allowExternalMedia={allowExternalMedia} />
          </Box>
          {content && content !== '' ? (
            <SafeHTML className={classes.popupContent}>{content}</SafeHTML>
          ) : null}
          {!editable ? (
            <Box className={classes.actionContainer}>
              <Tooltip title={t('map-popup-completed-label')}>
                <Box className={classes.innerActionContainer}>
                  <InputSwitch
                    size="small"
                    color="primary"
                    label={<AssignmentTurnedInIcon />}
                    value={Boolean(completed)}
                    onChange={onSwitchCompleted}
                  />
                </Box>
              </Tooltip>
              <Tooltip title={t('map-popup-copy-permalink-label')}>
                <Box className={classes.innerActionContainer}>
                  <IconButton onClick={onCopyPermalink}>
                    <LinkIcon />
                  </IconButton>
                </Box>
              </Tooltip>
            </Box>
          ) : null}
          {completed ? (
            <Typography className={classes.completedSubtitle}>
              {f('map-popup-completed-format', {
                time: displayUnixTimestamp(completed),
              })}
            </Typography>
          ) : null}
        </Box>
      </Popup>
    </Marker>
  );
};

const mapStateToProps = (state, { markerKey, feature }) => ({
  completed: state.completed.features[markerKey] ?? false,
  completedAlpha: state.options.completedAlpha,
  icons: feature.icons,
});
const mapDispatchToProps = (dispatch, { markerKey }) => ({
  markFeature: () => dispatch(setFeatureMarkerCompleted(markerKey)),
  unmarkFeature: () => dispatch(clearFeatureMarkerCompleted(markerKey)),
});
const FeatureMarker = connect(mapStateToProps, mapDispatchToProps)(_FeatureMarker);

export default FeatureMarker;
