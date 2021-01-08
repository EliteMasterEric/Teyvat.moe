ruby ./rip_yuanshen.rb

ruby ./migrate_marker_data.rb --input ../src/data/features/ --output ./output/migrated/

ruby ./merge_yuanshen_migrate.rb