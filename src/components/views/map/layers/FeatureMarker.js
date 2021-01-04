import { makeStyles, Box, Typography, Switch } from '@material-ui/core';
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { connect } from 'react-redux';

import { YOUTUBE_REGEX } from '~/components/data/MarkerDataFormatSchema';
import { displayUnixTimestamp, f, t } from '~/components/i18n/Localization';
import { createMapIcon } from '~/components/data/MapFeaturesData';
import { Image, useImageExtension } from '~/components/interface/Image';
import { localizeField } from '~/components/i18n/FeatureLocalization';
import YouTubeEmbed from '~/components/interface/YouTubeEmbed';

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
  completedContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 0,
    alignItems: 'center',
  },
  completedLabel: {
    fontSize: 12,
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
  icons,
  completed,
  completedAlpha,
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

  const onCompletedChanged = (event) => {
    if (event.target.checked) {
      markFeature();
    } else {
      unmarkFeature();
    }
  };

  const title = localizeField(marker.popupTitle);
  const content = localizeField(marker.popupContent);

  return (
    <Marker
      key={marker.id}
      position={marker.coordinates}
      icon={icon}
      opacity={completed ? completedAlpha : 1}
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
            <Typography className={classes.popupContent}>{content}</Typography>
          ) : null}
          <Box className={classes.completedContainer}>
            <Typography className={classes.completedLabel}>
              {t('map-popup-completed-label')}
            </Typography>
            <Switch
              size="small"
              color="primary"
              value={completed !== undefined}
              onChange={onCompletedChanged}
            />
          </Box>
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

const mapStateToProps = (state, { feature }) => ({
  completedAlpha: state.options.completedAlpha,
  icons: feature.icons,
});
const mapDispatchToProps = (_dispatch) => ({});
const FeatureMarker = connect(mapStateToProps, mapDispatchToProps)(_FeatureMarker);

export default FeatureMarker;
