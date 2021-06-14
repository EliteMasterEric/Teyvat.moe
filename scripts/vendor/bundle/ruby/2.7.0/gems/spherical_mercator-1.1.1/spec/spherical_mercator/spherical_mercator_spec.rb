require 'spec_helper'

MAX_EXTENT_MERC = [
  -20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244
].freeze

MAX_EXTENT_WGS84 = [
  -180, -85.0511287798066, 180, 85.0511287798066
].freeze

def rand_float
  rand(0.0...1.0)
end

def round(val)
  val.to_f.round(6)
end

describe SphericalMercator do
  let!(:sm) { SphericalMercator.new }
  let!(:sm_round) { SphericalMercator.new(round: false) }

  context '#bbox' do
    it '[0,0,0] converted to proper bbox' do
      expect(sm.bbox(0, 0, 1, true, 'WGS84')).to eq([-180, -85.05112877980659, 0, 0])
    end

    it '[0,0,1] converted to proper bbox' do
      expect(sm.bbox(0, 0, 0, true, 'WGS84')).to eq([-180, -85.05112877980659, 180, 85.0511287798066])
    end
  end

  context '#xyz' do
    it 'World extents converted to proper tile ranges' do
      expect(sm.xyz([-180, -85.05112877980659, 0, 0], 1, true, 'WGS84')).to eq({ minX: 0, minY: 0, maxX: 0, maxY: 0 })
    end

    it 'SW converted to proper tile ranges' do
      expect(sm.xyz([-180, -85.05112877980659, 180, 85.0511287798066], 0, true, 'WGS84')).to eq({ minX: 0, minY: 0, maxX: 0, maxY: 0 })
    end

    it 'broken' do
      extent = [-0.087891, 40.95703, 0.087891, 41.044916]
      xyz = sm.xyz(extent, 3, true, 'WGS84')

      expect(xyz[:minX] <= xyz[:maxX]).to be_truthy
      expect(xyz[:minY] <= xyz[:maxY]).to be_truthy
    end

    it 'negative' do
      extent = [-112.5, 85.0511, -112.5, 85.0511]
      xyz = sm.xyz(extent, 0)

      expect(xyz[:minY]).to be_zero
    end

    it 'fuzz' do
      1000.times do
        x = [-180 + (360 * rand_float), -180 + (360 * rand_float)]
        y = [-85 + (170 * rand_float), -85 + (170 * rand_float)]
        z = (22 * rand_float).floor

        extent = [
          x.min,
          y.min,
          x.max,
          y.max
        ]

        xyz = sm.xyz(extent, z, true, 'WGS84')

        if xyz[:minX] > xyz[:maxX]
          expect(xyz[:minX] <= xyz[:maxX]).to be_truthy
        end

        if xyz[:minY] > xyz[:maxY]
          expect(xyz[:minY] <= xyz[:maxY]).to be_truthy
        end
      end
    end
  end

  context '#convert' do
    it 'MAX_EXTENT_WGS84' do
      expect(sm.convert(MAX_EXTENT_WGS84, '900913')).to eq(MAX_EXTENT_MERC)
    end

    it 'MAX_EXTENT_MERC' do
      expect(sm.convert(MAX_EXTENT_MERC, 'WGS84')).to eq(MAX_EXTENT_WGS84)
    end
  end

  context '#extents' do
    it 'Maximum extents enforced on conversion to tile ranges' do
      expect(sm.xyz([-240, -90, 240, 90], 4, true, 'WGS84')).to eq({ minX: 0, minY: 0, maxX: 15, maxY: 15 })
    end

    it '' do
      expect(sm.convert([-240, -90, 240, 90], '900913')).to eq(MAX_EXTENT_MERC)
    end
  end

  context '#ll' do
    it 'LL with int zoom value converts' do
      expect(sm.ll([200, 200], 9)).to eq([-179.45068359375, 85.00351401304403])
    end

    it 'LL with float zoom value converts' do
      expect(sm.ll([200, 200], 8.6574)).to eq([-179.3034449476476, 84.99067388699072])
    end
  end

  context '#pp' do
    it 'PX with int zoom value converts' do
      expect(sm.px([-179, 85], 9)).to eq([364, 215])
    end

    it 'PX with float zoom value converts' do
      expect(sm.px([-179, 85], 8.6574)).to eq([287.12734093961626, 169.30444219392666])
    end
  
    it 'PX with forced rounding' do
      expect(sm_round.px([-179, 85], 9)).to eq([364.0888888888876, 214.68476683766494])
    end
  end

  context 'high precision float' do
    let(:withInt) { sm.ll([200, 200], 4) }
    let(:withFloat) { sm.ll([200, 200], 4.0000000001) }

    it 'first six decimals are the same' do
      expect(round(withInt[0])).to eq(round(withFloat[0]))
    end


    it 'first six decimals are the same' do
      expect(round(withInt[1])).to eq(round(withFloat[1]))
    end
  end
end
