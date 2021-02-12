import { makeStyles, Box, Typography, Tooltip, IconButton } from '@material-ui/core';
import { Link as LinkIcon } from '@material-ui/icons';
import React from 'react';
import { Popup } from 'react-leaflet';
import TextPath from 'react-leaflet-textpath';
import { connect } from 'react-redux';

import { YOUTUBE_REGEX } from '~/components/data/MarkerDataFormatSchema';
import { f, t } from '~/components/i18n/Localization';
import { Image } from '~/components/interface/Image';
import { localizeField } from '~/components/i18n/FeatureLocalization';
import YouTubeEmbed from '~/components/interface/YouTubeEmbed';
import { SafeHTML } from '~/components/Util';
import { copyPermalink } from '~/components/views/PermalinkHandler';

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

  mapRouteLine: {},

  mapRouteLineText: {
    fontSize: 20,
  },
}));

const RouteMedia = ({ media, allowExternalMedia }) => {
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

const _RouteLine = ({ route, editable = false, allowExternalMedia = false, routeKey = '' }) => {
  // CSS classes.
  const classes = useStyles();

  const onCopyPermalink = () => copyPermalink(route.id);

  const title = localizeField(route.popupTitle);
  const content = localizeField(route.popupContent);

  const eventHandlers = {
    add: (event) => {
      if (editable) {
        event.target.enableEdit();
      }
    },
  };

  return (
    <TextPath
      // Attributes passed to the parent Polyline.
      eventHandlers={eventHandlers}
      positions={route?.coordinates}
      color={route.routeColor}
      className={classes.mapRouteLine}
      // Attributes passed to TextPath.setText.
      text={route.routeText}
      repeat
      id={routeKey}
      attributes={{
        dy: 6,
        fill: route.routeColor,
        class: classes.mapRouteLineText,
      }}
    >
      {/* A modern variant of MapPopupLegacy. */}
      <Popup maxWidth={540} minWidth={192} autoPan={false} keepInView={false}>
        <Box className={classes.popupContainer}>
          {title && title !== '' ? (
            <Typography className={classes.popupTitle}>{title}</Typography>
          ) : (
            <Typography className={classes.popupTitle}>
              {f('editor-elements-route-id', { id: route.id.substring(0, 7) })}
            </Typography>
          )}
          <Box>
            <RouteMedia media={route.popupMedia} allowExternalMedia={allowExternalMedia} />
          </Box>
          {content && content !== '' ? (
            <SafeHTML className={classes.popupContent}>{content}</SafeHTML>
          ) : null}
          {!editable ? (
            <Box className={classes.actionContainer}>
              <Tooltip title={t('map-popup-copy-permalink-label')}>
                <Box className={classes.innerActionContainer}>
                  <IconButton onClick={onCopyPermalink}>
                    <LinkIcon />
                  </IconButton>
                </Box>
              </Tooltip>
            </Box>
          ) : null}
        </Box>
      </Popup>
    </TextPath>
  );
};

const mapStateToProps = (_state) => ({});
const mapDispatchToProps = (_dispatch) => ({});
const RouteLine = connect(mapStateToProps, mapDispatchToProps)(_RouteLine);

export default RouteLine;
