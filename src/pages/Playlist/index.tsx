import React from 'react';
import {List, Paper} from "@material-ui/core";
import {connect, history} from 'umi'
import PlayListDetail from '@/components/PlayListDetail'
import ListSongItem from '@/components/ListSongItem'
import {ConnectState, Dispatch} from "@/models/connect";
import {PlaylistInfo} from '@/models/playlist'
import MaskLoading from '@/components/Loading/MaskLoading'
import CheckPlaying from "@/components/CheckPlaying";

type Props = {
  location: {
    query: {
      id: string
    }
  },
  dispatch: (parse: Dispatch) => void
  playlistInfo: PlaylistInfo
  classes: any
  playlist: any[]
  detailLoading: boolean | undefined
  loading: boolean | undefined
};
type State = {};

class Playlist extends React.Component<Props, State> {

  componentDidMount() {

    const {location: {query}, dispatch} = this.props;

    if (query.id)
      dispatch({
        type: 'playlist/fetchPlaylistDetail',
        payload: {id: query.id}
      })
    else history.replace(`/`)

  }

  // componentDidUpdate(prevProps: Readonly<Props>,) {
  //   console.log('componentDidUpdate')
  //   console.log(prevProps)
  // }

  handlePlay = (item: any) => {
    const { dispatch} = this.props;
    dispatch({
      type: 'play/fetchSongUrl',
      payload: {id: item.id}
    })

  }

  render() {
    const {playlistInfo, playlist, detailLoading, loading} = this.props;


    return (
      <>
        <PlayListDetail {...playlistInfo} loading={detailLoading} />

        <Paper style={{padding: '2rem', marginTop: '4rem', minHeight: 300, position: 'relative'}}>
          {loading && <MaskLoading />}
          <List component="div" disablePadding hidden={playlist.length === 0}>
            {
              playlist.map((item: any) => (
                <CheckPlaying currentSongId={item.id} key={item.id}>
                  {
                    (state: boolean) => <ListSongItem
                      isItem={state}  item={item} onPlayClick={this.handlePlay}
                    />
                  }
                </CheckPlaying>
              ))
            }
          </List>
        </Paper>

      </>
    );
  };
}


const mapStateToProps = ({playlist, loading}: ConnectState) => ({
  playlistInfo: playlist.playlistInfo,
  playlist: playlist.playlist,
  detailLoading: loading.effects['playlist/fetchPlaylistDetail'],
  loading: loading.effects['playlist/fetchPlaylist']
})

export default connect(mapStateToProps)(Playlist)
